#!/usr/bin/env python3
"""SC6 file parser using sc-compression for decompression.

SC6 (used by newer Brawl Stars) differs from SC5 in:
  - Compression is handled by sc-compression (multi-algorithm)
  - No FileDescriptor in the header — the DataStorage FlatBuffer
    starts immediately after decompression, followed by the chunked
    resources (ExportNames, TextFields, Shapes, MovieClips, Modifiers,
    Textures).

This parser mirrors the sc5-parser's SC5File API so the render module
can be reused unchanged.

Usage (called from extract_effects.py):
    from sc6_parser import SC6File
    sc = SC6File(str(src))
    textures = decode_textures(sc)
    info = sc.get_export_frame_info(name)
    frames = sc.extract_sprite_with_offset(name, textures, frame_index=fi)
"""

from __future__ import annotations

import struct
import warnings
from pathlib import Path
from typing import Any

import numpy as np
import zstandard
from PIL import Image

# Vendored third-party packages (sc5_parser, sc_compression) so this toolchain
# is fully self-contained inside project_brawlstars and survives a fresh clone.
import os as _os
import sys as _sys
_VENDOR_DIR = _os.path.join(_os.path.dirname(_os.path.abspath(__file__)), "vendor")
if _VENDOR_DIR not in _sys.path:
    _sys.path.insert(0, _VENDOR_DIR)

from sc5_parser._schemas.sc.flash.SC2.DataStorage import DataStorage
from sc5_parser._schemas.sc.flash.SC2.ExportNames import ExportNames
from sc5_parser._schemas.sc.flash.SC2.ExternalMatrixBanks import ExternalMatrixBanks
from sc5_parser._schemas.sc.flash.SC2.FileDescriptor import FileDescriptor
from sc5_parser._schemas.sc.flash.SC2.MovieClipModifiers import MovieClipModifiers
from sc5_parser._schemas.sc.flash.SC2.MovieClips import MovieClips
from sc5_parser._schemas.sc.flash.SC2.CompressedMovieClips import CompressedMovieClips
from sc5_parser._schemas.sc.flash.SC2.Precision import Precision
from sc5_parser._schemas.sc.flash.SC2.Shapes import Shapes
from sc5_parser._schemas.sc.flash.SC2.TextFields import TextFields
from sc5_parser._schemas.sc.flash.SC2.Textures import Textures
from sc5_parser.models import (
    ColorTransform,
    FrameElement,
    Matrix2x3,
    MovieClipData,
    RenderContext,
    ScalingGrid,
    ShapeDict,
    TextFieldData,
)

_NO_TRANSFORM = 0xFFFF
_NO_FRAME_ELEMENTS = 0xFFFFFFFF

_MAX_DECOMPRESS_SIZE = 100 * 1024 * 1024


def _sign_extend_16(v: int) -> int:
    v &= 0xFFFF
    if v & 0x8000:
        v -= 0x10000
    return v


def _get_bit_integer(number: int, offset: int, length: int) -> int:
    """Signed bit-field extract, mirroring Java (number << (32-o-l)) >> (32-l)."""
    shifted = (number << (32 - offset - length)) & 0xFFFFFFFF
    if shifted & 0x80000000:
        shifted -= 0x100000000
    return shifted >> (32 - length)


def _get_unsigned_bit_integer(number: int, offset: int, length: int) -> int:
    return (number >> offset) & ((1 << length) - 1)


def _bitfield_signed(v17: int, bits: int, off: int) -> int:
    val = (v17 >> off) & ((1 << bits) - 1)
    if val >= (1 << (bits - 1)):
        val -= (1 << bits)
    return val


def _decode_compressed_matrix_block(
    bank: bytes,
    matrix_data_position: int,
    metadata_position: int,
    block_index: int,
) -> list[Matrix2x3]:
    """Decode one 16-matrix compressed block from an SC6 external matrix bank.

    Mirrors sc-editor's ScCompressedMatrixBank.decodeBlock().
    Returns 16 matrices.
    """
    metadata = struct.unpack_from("<I", bank, metadata_position + block_index * 4)[0]
    base_matrix_index = metadata & ((1 << 13) - 1)
    delta_index = (metadata >> 13) & ((1 << 19) - 1)

    base_pos = matrix_data_position + base_matrix_index * 12
    a, b, c, d, x, y = struct.unpack_from("<6H", bank, base_pos)

    matrices: list[Matrix2x3] = []
    for i in range(16):
        flag_pos = matrix_data_position + delta_index * 2
        flag = struct.unpack_from("<H", bank, flag_pos)[0]
        if (flag & 3) != 0:
            flag_low = flag & 0xF
            if flag_low == 1:
                data1 = struct.unpack_from("<H", bank, flag_pos + 2)[0]
                x += _get_bit_integer((data1 << 16) | flag, 4, 14)
                y += _get_bit_integer(data1, 2, 14)
                delta_index += 2
            elif flag_low == 2:
                data1 = struct.unpack_from("<H", bank, flag_pos + 2)[0]
                a += _get_bit_integer(flag, 4, 7)
                d += _get_bit_integer((data1 << 16) | flag, 11, 7)
                x += _get_bit_integer(data1, 2, 7)
                y += _get_bit_integer(data1, 9, 7)
                delta_index += 2
            elif flag_low == 3:
                data1 = struct.unpack_from("<H", bank, flag_pos + 2)[0]
                data2 = struct.unpack_from("<H", bank, flag_pos + 4)[0]
                a += _get_bit_integer(flag, 4, 11)
                d += _get_bit_integer((data1 << 16) | flag, 15, 11)
                x += _get_bit_integer((data2 << 16) | data1, 10, 11)
                y += _get_bit_integer(data2, 5, 11)
                delta_index += 3
            elif flag_low == 5:
                data1 = struct.unpack_from("<H", bank, flag_pos + 2)[0]
                data2 = struct.unpack_from("<H", bank, flag_pos + 4)[0]
                a += _get_bit_integer(flag, 4, 7)
                b += _get_bit_integer((data1 << 16) | flag, 11, 7)
                c += _get_bit_integer(data1, 2, 7)
                d += _get_bit_integer(data1, 9, 7)
                x += _get_bit_integer(data2, 0, 8)
                y += _get_bit_integer(data2, 8, 8)
                delta_index += 3
            elif flag_low == 6:
                data1 = struct.unpack_from("<H", bank, flag_pos + 2)[0]
                data2 = struct.unpack_from("<H", bank, flag_pos + 4)[0]
                data3 = struct.unpack_from("<H", bank, flag_pos + 6)[0]
                a += _get_bit_integer(flag, 4, 10)
                b += _get_bit_integer((data1 << 16) | flag, 14, 10)
                c += _get_bit_integer((data2 << 16) | data1, 8, 10)
                d += _get_bit_integer(data2, 2, 10)
                x += _get_bit_integer((data3 << 16) | data2, 12, 10)
                y += _get_bit_integer(data3, 6, 10)
                delta_index += 4
            elif flag_low == 7:
                data1 = struct.unpack_from("<H", bank, flag_pos + 2)[0]
                data2 = struct.unpack_from("<H", bank, flag_pos + 4)[0]
                data3 = struct.unpack_from("<H", bank, flag_pos + 6)[0]
                data4 = struct.unpack_from("<H", bank, flag_pos + 8)[0]
                a += _get_bit_integer(flag, 4, 12)
                b += _get_bit_integer((data2 << 16) | data1, 0, 12)
                c += _get_bit_integer((data2 << 16) | data1, 12, 12)
                d += _get_bit_integer((data3 << 16) | data2, 8, 12)
                x += _get_bit_integer((data4 << 16) | data3, 4, 14)
                y += _get_bit_integer(data4, 2, 14)
                delta_index += 5
            elif flag_low == 0xF:
                a += struct.unpack_from("<H", bank, flag_pos + 2)[0]
                b += struct.unpack_from("<H", bank, flag_pos + 4)[0]
                c += struct.unpack_from("<H", bank, flag_pos + 6)[0]
                d += struct.unpack_from("<H", bank, flag_pos + 8)[0]
                x += struct.unpack_from("<H", bank, flag_pos + 10)[0]
                y += struct.unpack_from("<H", bank, flag_pos + 12)[0]
                delta_index += 7
            else:
                delta_index += 1
        else:
            x += _get_bit_integer(flag, 2, 7)
            y += _get_bit_integer(flag, 9, 7)
            delta_index += 1

        sa = _sign_extend_16(a)
        sb = _sign_extend_16(b)
        sc_ = _sign_extend_16(c)
        sd = _sign_extend_16(d)
        sx = _sign_extend_16(x)
        sy = _sign_extend_16(y)
        matrices.append(Matrix2x3(
            a=sa / 1024.0, b=sb / 1024.0,
            c=sc_ / 1024.0, d=sd / 1024.0,
            tx=sx / 20.0, ty=sy / 20.0,
        ))
    return matrices


def _decode_compressed_frame_data(
    words: list[int], ed: int, es: int, ee: int, max_out: int = 10000
) -> list[int]:
    """Decode Supercell compressed movieclip frame element data.

    Returns a flat list of u16 triples (child_index, matrix_index, color_index).
    """
    result: list[int] = []
    v6 = 0
    if es == ed:
        for k in range(es, ee):
            result.append(int(words[k]))
        return result
    pos = es
    while pos != ee and len(result) + 6 <= max_out:
        v17 = int(words[pos])
        v13 = int(words[ed])
        v14 = int(words[ed + 1])
        v16 = int(words[ed + 2])
        if (v6 & 1) != 0:
            result += [v13, v14, v16]
            ed += 3
            pos += 1
            v6 >>= 1
        else:
            v6 >>= 1
            if (v17 & 3) != 0:
                case = v17 & 7
                if case == 1:
                    result += [v13, _bitfield_signed(v17, 13, 3) + v14, v16]
                    ed += 3
                    pos += 1
                elif case == 2:
                    result += [
                        v13,
                        _bitfield_signed(v17, 4, 3) + v14,
                        _bitfield_signed(v17, 7, 9) + v16,
                    ]
                    ed += 3
                    pos += 1
                elif case == 3:
                    result += [v13, int(words[pos + 1]) + v14, _bitfield_signed(v17, 13, 3) + v16]
                    ed += 3
                    pos += 2
                elif case == 5:
                    result += [v13, v14, v16]
                    ed += 3
                    pos += 1
                    v6 = _sign_extend_16(v17) >> 3
                elif case == 6:
                    ed += 3 * _bitfield_signed(v17, 13, 3)
                    pos += 1
                elif case == 7:
                    result.append(_bitfield_signed(v17, 12, 3))
                    result.append(int(words[pos + 1]))
                    result.append(int(words[pos + 2]))
                    pos += 3
                    if (v17 & 0x8000) != 0:
                        ed += 3
            else:
                result += [
                    v13,
                    _bitfield_signed(v17, 7, 2) + v14,
                    v16,
                    int(words[ed + 3]),
                    _bitfield_signed(v17, 7, 9) + int(words[ed + 4]),
                    int(words[ed + 5]),
                ]
                ed += 6
                pos += 1
                v6 >>= 1
    while v6 and len(result) + 3 <= max_out:
        if (v6 & 1) == 0:
            break
        result += [int(words[ed]), int(words[ed + 1]), int(words[ed + 2])]
        ed += 3
        v6 >>= 1
    return result


def _decode_movieclip_frames(
    frame_data: bytes, movie_clip_data_position: int
) -> list[list[FrameElement]]:
    """Decode an SC6 movieclip's external frame element data.

    Mirrors sc-editor's ExternalMovieClipFrameElementDecoder.decodeMovieClipFrames().
    ``movie_clip_data_position`` is relative to the bank's frame-data buffer.
    Returns one list of FrameElement per frame.
    """
    pos = movie_clip_data_position
    frame_count = struct.unpack_from("<I", frame_data, pos)[0]
    # element_count / u3 are header info; the RLE decoder state also
    # persists across frames within one clip (mirrors the Java field).
    unmodified_element_mask = 0
    pos += 8  # skip u32 frame_count + u16 element_count + u16 u3

    frames: list[list[FrameElement]] = []
    for _ in range(frame_count):
        frame_data_offset = struct.unpack_from("<i", frame_data, pos)[0]
        frame_element_data_index = struct.unpack_from("<H", frame_data, pos + 4)[0]
        frame_element_data_end_index = struct.unpack_from("<H", frame_data, pos + 6)[0]
        pos += 8

        frame_data_position = movie_clip_data_position + frame_data_offset
        if frame_element_data_index == 0:
            # raw triples
            count = (frame_element_data_end_index - frame_element_data_index) // 3
            elems: list[FrameElement] = []
            p = frame_data_position
            for _ in range(count):
                child = struct.unpack_from("<H", frame_data, p)[0]
                matrix = struct.unpack_from("<H", frame_data, p + 2)[0]
                color = struct.unpack_from("<H", frame_data, p + 4)[0]
                elems.append(FrameElement(child, matrix, color))
                p += 6
            frames.append(elems)
        else:
            elems = _decode_frame_elements(
                frame_data,
                frame_data_position,
                frame_element_data_index,
                frame_element_data_end_index,
                unmodified_element_mask,
            )
            unmodified_element_mask = elems[1]
            frames.append(elems[0])
    return frames


def _get_short_at(buf: bytes, p: int) -> int:
    return struct.unpack_from("<H", buf, p)[0]


def _decode_frame_elements(
    frame_data: bytes,
    frame_data_position: int,
    frame_element_data_index: int,
    frame_element_data_end_index: int,
    unmodified_element_mask: int,
) -> tuple[list[FrameElement], int]:
    """Mask-based RLE decode of one frame's elements (sc-editor port).

    Mirrors ExternalMovieClipFrameElementDecoder.decodeFrameElements(): the
    metadata stream starts at frame_data_position + index*2 and the element
    data stream starts at frame_data_position.
    """
    elements: list[FrameElement] = []
    meta_pos = frame_data_position + frame_element_data_index * 2
    element_data_pos = frame_data_position
    end_index = frame_data_position + frame_element_data_end_index * 2

    while meta_pos < end_index:
        if (unmodified_element_mask & 1) != 0:
            elements.append(FrameElement(
                _get_short_at(frame_data, element_data_pos),
                _get_short_at(frame_data, element_data_pos + 2),
                _get_short_at(frame_data, element_data_pos + 4),
            ))
            element_data_pos += 6
            unmodified_element_mask >>= 1
            continue
        unmodified_element_mask >>= 1

        metadata = _get_short_at(frame_data, meta_pos)
        meta_pos += 2

        if _get_unsigned_bit_integer(metadata, 0, 2) != 0:
            switch_val = _get_unsigned_bit_integer(metadata, 0, 3)
            if switch_val == 1:
                elements.append(FrameElement(
                    _get_short_at(frame_data, element_data_pos),
                    (_get_short_at(frame_data, element_data_pos + 2)
                     + _get_bit_integer(metadata, 3, 13)) & 0xFFFF,
                    _get_short_at(frame_data, element_data_pos + 4),
                ))
                element_data_pos += 6
            elif switch_val == 2:
                elements.append(FrameElement(
                    _get_short_at(frame_data, element_data_pos),
                    (_get_short_at(frame_data, element_data_pos + 2)
                     + _get_bit_integer(metadata, 3, 4)) & 0xFFFF,
                    (_get_short_at(frame_data, element_data_pos + 4)
                     + _get_bit_integer(metadata, 7, 9)) & 0xFFFF,
                ))
                element_data_pos += 6
            elif switch_val == 3:
                delta = _get_short_at(frame_data, meta_pos)
                meta_pos += 2
                elements.append(FrameElement(
                    _get_short_at(frame_data, element_data_pos),
                    (_get_short_at(frame_data, element_data_pos + 2) + delta) & 0xFFFF,
                    (_get_short_at(frame_data, element_data_pos + 4)
                     + _get_bit_integer(metadata, 3, 13)) & 0xFFFF,
                ))
                element_data_pos += 6
            elif switch_val == 5:
                elements.append(FrameElement(
                    _get_short_at(frame_data, element_data_pos),
                    _get_short_at(frame_data, element_data_pos + 2),
                    _get_short_at(frame_data, element_data_pos + 4),
                ))
                element_data_pos += 6
                unmodified_element_mask = _get_unsigned_bit_integer(metadata, 3, 13)
            elif switch_val == 6:
                elements_to_skip = _get_bit_integer(metadata, 3, 13)
                element_data_pos += elements_to_skip * 6
            elif switch_val == 7:
                elements_to_skip = _get_unsigned_bit_integer(metadata, 15, 1)
                element_data_pos += 6 * elements_to_skip
                child_index = _get_bit_integer(metadata, 3, 12)
                matrix_index = _get_short_at(frame_data, meta_pos)
                color_index = _get_short_at(frame_data, meta_pos + 2)
                meta_pos += 4
                elements.append(FrameElement(
                    child_index & 0xFFFF, matrix_index, color_index,
                ))
        else:
            elements.append(FrameElement(
                _get_short_at(frame_data, element_data_pos),
                (_get_short_at(frame_data, element_data_pos + 2)
                 + _get_bit_integer(metadata, 2, 7)) & 0xFFFF,
                _get_short_at(frame_data, element_data_pos + 4),
            ))
            element_data_pos += 6
            elements.append(FrameElement(
                _get_short_at(frame_data, element_data_pos),
                (_get_short_at(frame_data, element_data_pos + 2)
                 + _get_bit_integer(metadata, 9, 7)) & 0xFFFF,
                _get_short_at(frame_data, element_data_pos + 4),
            ))
            element_data_pos += 6
            unmodified_element_mask >>= 1

    while unmodified_element_mask != 0:
        elements.append(FrameElement(
            _get_short_at(frame_data, element_data_pos),
            _get_short_at(frame_data, element_data_pos + 2),
            _get_short_at(frame_data, element_data_pos + 4),
        ))
        element_data_pos += 6
        unmodified_element_mask >>= 1

    return elements, unmodified_element_mask


def _precision_divisor(precision: int) -> float:
    if precision == Precision.Twip:
        return 20.0
    if precision == Precision.Optimized:
        return 1024.0
    return 1.0


class SC6File:
    """Parsed representation of an SC v6 file (decompressed via sc-compression)."""

    def __init__(self, sc_path: str | Path) -> None:
        self.sc_path = Path(sc_path)
        self.shapes: list[ShapeDict] = []
        self.exports: dict[str, int] = {}
        self.textures: list[dict[str, Any]] = []
        self.movie_clip_data: dict[int, MovieClipData] = {}
        self._decoded_frames: dict[int, list[list[FrameElement]]] = {}
        self.text_fields: dict[int, TextFieldData] = {}
        self.modifiers: dict[int, int] = {}
        self.strings: list[str] = []
        self.vertices: list[tuple[float, float, int, int]] = []
        self._scaling_rects: list[ScalingGrid] = []
        self.shape_id_to_idx: dict[int, list[int]] = {}
        self._frame_elements: np.ndarray | None = None
        self.matrix_banks: list[list[Matrix2x3]] = []
        self.color_banks: list[list[ColorTransform]] = []
        self._clip_data_buffers: list[bytes] = []
        self._resources_offset = 0
        self._parse()

    # ------------------------------------------------------------------
    def _parse(self) -> None:
        raw = self.sc_path.read_bytes()

        if len(raw) < 10:
            raise ValueError(f"Invalid SC file: too small ({len(raw)} bytes)")
        if raw[:2] != b"SC":
            raise ValueError(f"Not an SC file: {self.sc_path}")
        version = struct.unpack("<I", raw[2:6])[0]
        if version != 6:
            raise ValueError(f"SC6File expected version 6, got {version}")

        # Decompress using sc-compression (handles SC6 header differences)
        from sc_compression import decompress
        result = decompress(raw)
        inner = result[0]

        # --- DataStorage ------------------------------------------------
        ds_size = struct.unpack("<I", inner[0:4])[0]
        ds = DataStorage.GetRootAs(bytes(inner[4 : 4 + ds_size]), 0)

        self.strings = [
            (ds.Strings(i).decode() if ds.Strings(i) else "")
            for i in range(ds.StringsLength())
        ]

        bp_len = ds.ShapesBitmapPoinsLength()
        if bp_len:
            bp_data = bytes(ds.ShapesBitmapPoins(i) for i in range(bp_len))
            for i in range(bp_len // 12):
                off = i * 12
                x = struct.unpack("<f", bp_data[off : off + 4])[0]
                y = struct.unpack("<f", bp_data[off + 4 : off + 8])[0]
                u = struct.unpack("<H", bp_data[off + 8 : off + 10])[0]
                v = struct.unpack("<H", bp_data[off + 10 : off + 12])[0]
                self.vertices.append((x, y, u, v))

        # --- Frame elements (u16 array) ---------------------------------
        tab = ds._tab
        fe_field_off = tab.Offset(12)
        if fe_field_off:
            fe_vec_off = tab.Vector(fe_field_off)
            fe_count = struct.unpack("<I", tab.Bytes[fe_vec_off - 4 : fe_vec_off])[0]
            self._frame_elements = np.frombuffer(
                tab.Bytes, dtype="<u2", offset=fe_vec_off, count=fe_count
            )
        else:
            self._frame_elements = np.array([], dtype="<u2")

        # --- Scaling grid rectangles ------------------------------------
        for ri in range(ds.RectanglesLength()):
            r = ds.Rectangles(ri)
            self._scaling_rects.append(
                ScalingGrid(left=r.Left(), top=r.Top(), right=r.Right(), bottom=r.Bottom())
            )

        # --- FileDescriptor: precision + external bank location -----------
        hdr = 12  # SC v6 header: 'SC' + u32 version + u32 fd_size
        fd_size = struct.unpack("<I", raw[hdr - 4 : hdr])[0]
        fd = FileDescriptor.GetRootAs(raw[hdr : hdr + fd_size], 0)
        scale_div = _precision_divisor(fd.ScalePrecision())
        trans_div = _precision_divisor(fd.TranslationPrecision())

        comp_start = hdr + fd_size
        ext_mb_data: bytes | None = None
        ext_mb_size = fd.ExternalMatrixBankSize() or 0
        if ext_mb_size > 0:
            ext_start = comp_start + (fd.CompressedSize() or 0)
            ext_mb_data = bytes(raw[ext_start : ext_start + ext_mb_size])

        # --- Internal matrix banks (may be empty; external banks usually
        #     hold the real data for SC6 effects files) ---------------------
        for bi in range(ds.MatrixBanksLength()):
            bank_fb = ds.MatrixBanks(bi)
            matrices: list[Matrix2x3] = []
            if bank_fb.MatricesLength() > 0:
                for mi in range(bank_fb.MatricesLength()):
                    m = bank_fb.Matrices(mi)
                    matrices.append(Matrix2x3(a=m.A(), b=m.B(), c=m.C(), d=m.D(), tx=m.Tx(), ty=m.Ty()))
            elif bank_fb.HalfMatricesLength() > 0:
                for mi in range(bank_fb.HalfMatricesLength()):
                    m = bank_fb.HalfMatrices(mi)
                    matrices.append(Matrix2x3(
                        a=m.A() / scale_div,
                        b=m.B() / scale_div,
                        c=m.C() / scale_div,
                        d=m.D() / scale_div,
                        tx=m.Tx() / trans_div,
                        ty=m.Ty() / trans_div,
                    ))
            self.matrix_banks.append(matrices)
            colors: list[ColorTransform] = []
            for ci in range(bank_fb.ColorsLength()):
                c = bank_fb.Colors(ci)
                colors.append(ColorTransform(
                    r_mul=c.RMul(), g_mul=c.GMul(), b_mul=c.BMul(),
                    alpha=c.Alpha(),
                    r_add=c.RAdd(), g_add=c.GAdd(), b_add=c.BAdd(),
                ))
            self.color_banks.append(colors)

        # --- External matrix banks (decompressed zstd; holds the matrices,
        #     color transforms, and per-clip frame data) --------------------
        if ext_mb_data is not None and len(ext_mb_data) >= 4:
            try:
                desc_size = struct.unpack_from("<I", ext_mb_data, 0)[0]
                embs = ExternalMatrixBanks.GetRootAs(
                    bytes(ext_mb_data[4 : 4 + desc_size]), 0
                )
                banks_data_offset = 4 + desc_size
                for bi in range(embs.BanksLength()):
                    eb = embs.Banks(bi)
                    coff = banks_data_offset + eb.CompressedDataOffset()
                    csz = eb.CompressedDataSize()
                    dsz = eb.DecompressedDataSize()
                    if csz == 0 or dsz == 0:
                        continue
                    bank_data = zstandard.ZstdDecompressor().decompress(
                        ext_mb_data[coff : coff + csz],
                        max_output_size=dsz,
                    )
                    idx = eb.Index()
                    float_matrix_count = eb.FloatMatrixCount()
                    short_matrix_count = eb.ShortMatrixCount()
                    block_count = eb.CompressedMatrixDataSize()
                    blocks_data_size = eb.ShortMatrixDataSize()
                    color_count = eb.ColorTransformCount()
                    frame_off = eb.ClipDataOffset()
                    frame_sz = eb.ClipDataSize()

                    uncompressed_count = float_matrix_count + short_matrix_count
                    total_matrix_count = max(
                        uncompressed_count, block_count * 16
                    )
                    while len(self.matrix_banks) <= idx:
                        self.matrix_banks.append([])
                        self.color_banks.append([])
                    while len(self._clip_data_buffers) <= idx:
                        self._clip_data_buffers.append(b"")

                    ext_matrices: list[Matrix2x3] = [Matrix2x3()] * total_matrix_count
                    off = 0
                    for mi in range(float_matrix_count):
                        a, b, c, d, tx, ty = struct.unpack_from("<6f", bank_data, off)
                        ext_matrices[mi] = Matrix2x3(a=a, b=b, c=c, d=d, tx=tx, ty=ty)
                        off += 24
                    # Short matrices sit after float matrices + block metadata.
                    off = float_matrix_count * 24 + block_count * 4
                    for mi in range(short_matrix_count):
                        sa, sb, sc_, sd, stx, sty = struct.unpack_from("<6h", bank_data, off)
                        ext_matrices[float_matrix_count + mi] = Matrix2x3(
                            a=sa / 1024.0, b=sb / 1024.0,
                            c=sc_ / 1024.0, d=sd / 1024.0,
                            tx=stx / 20.0, ty=sty / 20.0,
                        )
                        off += 12
                    # Compressed blocks decode matrices above the uncompressed range.
                    metadata_position = float_matrix_count * 24
                    matrix_data_position = metadata_position + block_count * 4
                    for mi in range(uncompressed_count, total_matrix_count):
                        block_index = mi >> 4
                        block_matrices = _decode_compressed_matrix_block(
                            bank_data, matrix_data_position, metadata_position, block_index
                        )
                        base = block_index * 16
                        for j in range(16):
                            if base + j < total_matrix_count:
                                ext_matrices[base + j] = block_matrices[j]
                    self.matrix_banks[idx] = ext_matrices
                    ct_off = (float_matrix_count * 24
                              + block_count * 4
                              + blocks_data_size * 2)
                    ext_colors: list[ColorTransform] = []
                    for _ in range(color_count):
                        vals = struct.unpack_from("<7B", bank_data, ct_off)
                        ext_colors.append(ColorTransform(
                            r_mul=vals[0], g_mul=vals[1], b_mul=vals[2],
                            alpha=vals[3],
                            r_add=vals[4], g_add=vals[5], b_add=vals[6],
                        ))
                        ct_off += 7
                    self.color_banks[idx] = ext_colors
                    # The clip-data region starts AFTER the color transforms
                    # (mirrors sc-editor: byteBuffer.slice(colorEnd + frame_off)).
                    color_end = ct_off
                    self._clip_data_buffers[idx] = bank_data[
                        frame_off : frame_off + frame_sz
                    ]
            except Exception:
                warnings.warn(
                    f"Failed to parse external matrix/color banks in {self.sc_path}",
                    stacklevel=2,
                )

        # --- Chunked resources: start after DataStorage (4 + ds_size) ---
        self._resources_offset = 4 + ds_size
        pos = self._resources_offset

        # ExportNames
        en_size = struct.unpack("<I", inner[pos : pos + 4])[0]
        en = ExportNames.GetRootAs(bytes(inner[pos + 4 : pos + 4 + en_size]), 0)
        for i in range(en.ObjectIdsLength()):
            oid = en.ObjectIds(i)
            nref = en.NameRefIds(i) if i < en.NameRefIdsLength() else 0
            name = (
                self.strings[nref]
                if 0 < nref < len(self.strings)
                else ""
            )
            if name:
                self.exports[name] = oid
        pos += 4 + en_size

        # TextFields
        tf_size = struct.unpack("<I", inner[pos : pos + 4])[0]
        if tf_size > 0:
            tf = TextFields.GetRootAs(bytes(inner[pos + 4 : pos + 4 + tf_size]), 0)
            for i in range(tf.TextfieldsLength()):
                tfd = tf.Textfields(i)
                tf_id = tfd.Id()
                font_ref = tfd.FontNameRefId()
                text_ref = tfd.TextRefId()
                typo_ref = tfd.TypographyRefId()
                self.text_fields[tf_id] = TextFieldData(
                    id=tf_id,
                    font_name=(
                        self.strings[font_ref]
                        if 0 < font_ref < len(self.strings) else ""),
                    text=(
                        self.strings[text_ref]
                        if 0 < text_ref < len(self.strings) else ""),
                    typography_file=(
                        self.strings[typo_ref]
                        if 0 < typo_ref < len(self.strings) else ""),
                    left=tfd.Left(),
                    top=tfd.Top(),
                    right=tfd.Right(),
                    bottom=tfd.Bottom(),
                    font_color=tfd.FontColor(),
                    outline_color=tfd.OutlineColor(),
                    font_size=tfd.FontSize(),
                    align=tfd.Align(),
                    styles=tfd.Styles(),
                )
        pos += 4 + tf_size

        # Shapes
        sh_size = struct.unpack("<I", inner[pos : pos + 4])[0]
        sh = Shapes.GetRootAs(bytes(inner[pos + 4 : pos + 4 + sh_size]), 0)
        for i in range(sh.ShapesLength()):
            shape = sh.Shapes(i)
            commands: list[dict[str, Any]] = []
            for j in range(shape.CommandsLength()):
                cmd = shape.Commands(j)
                verts = [
                    self.vertices[cmd.PointsOffset() + k]
                    for k in range(cmd.PointsCount())
                ]
                commands.append(
                    {"texture_index": cmd.TextureIndex(), "vertices": verts}
                )
            sid = shape.Id()
            self.shapes.append({"id": sid, "commands": commands})
            self.shape_id_to_idx.setdefault(sid, []).append(
                len(self.shapes) - 1
            )
        pos += 4 + sh_size

        # MovieClips (regular or compressed variant).  SC6 files store the
        # frame element data in the compressed variant (CompressedDataOffset)
        # referencing the external bank clip buffers, so parse both tables.
        mc_size = struct.unpack("<I", inner[pos : pos + 4])[0]
        mc_buf = bytes(inner[pos + 4 : pos + 4 + mc_size])
        mc = MovieClips.GetRootAs(mc_buf, 0)

        if mc.MovieclipsLength() > 0:
            self._parse_movie_clips(mc)
        try:
            cmc = CompressedMovieClips.GetRootAs(mc_buf, 0)
            if cmc.MovieclipsLength() > 0:
                for i in range(cmc.MovieclipsLength()):
                    try:
                        self._parse_movie_clip(cmc.Movieclips(i))
                    except Exception:
                        warnings.warn(
                            f"Failed to parse compressed movie clip {i} in {self.sc_path}",
                            stacklevel=2,
                        )
        except Exception:
            warnings.warn(
                f"Failed to parse compressed movie clips in {self.sc_path}",
                stacklevel=2,
            )
        pos += 4 + mc_size

        # MovieClipModifiers
        mod_size = struct.unpack("<I", inner[pos : pos + 4])[0]
        if mod_size > 0:
            mods = MovieClipModifiers.GetRootAs(
                bytes(inner[pos + 4 : pos + 4 + mod_size]), 0
            )
            for i in range(mods.ModifiersLength()):
                m = mods.Modifiers(i)
                self.modifiers[m.Id()] = m.Type()
        pos += 4 + mod_size

        # Textures
        tex_size = struct.unpack("<I", inner[pos : pos + 4])[0]
        tex = Textures.GetRootAs(
            bytes(inner[pos + 4 : pos + 4 + tex_size]), 0
        )
        for i in range(tex.TexturesLength()):
            tset = tex.Textures(i)
            hr = tset.Highres()
            if hr:
                ext = (
                    hr.ExternalTexture().decode()
                    if hr.ExternalTexture()
                    else None
                )
                self.textures.append(
                    {
                        "width": hr.Width(),
                        "height": hr.Height(),
                        "pixel_type": hr.PixelType(),
                        "external": ext,
                    }
                )

        # Extract the embedded texture data that follows the chunk chain
        pos += 4 + tex_size
        self._extract_embedded_textures(inner, pos)
        
    def _extract_embedded_textures(self, inner: bytes, chunks_end: int) -> None:
        """Extract KTX-embedded texture data from the tail of the decompressed stream."""
        # Some SC6 files have the KTX magic; others have raw pixel data.
        ktx_magic = b"\xabKTX 11\xbb\r\n\x1a\n"
        ktx_pos = inner.find(ktx_magic)
        
        if ktx_pos >= 0:
            try:
                ktx_width = struct.unpack_from("<I", inner, ktx_pos + 36)[0]
                ktx_height = struct.unpack_from("<I", inner, ktx_pos + 40)[0]
                ktx_internal = struct.unpack_from("<I", inner, ktx_pos + 28)[0]
                ktx_base = struct.unpack_from("<I", inner, ktx_pos + 32)[0]
                kv_size = struct.unpack_from("<I", inner, ktx_pos + 60)[0]

                data_off = ktx_pos + 64 + kv_size
                if kv_size % 4 != 0:
                    data_off += 4 - (kv_size % 4)

                mip_size = struct.unpack_from("<I", inner, data_off)[0]
                mip_data = bytes(inner[data_off + 4 : data_off + 4 + mip_size])

                for tex_dict in self.textures:
                    tex_dict["ktx_internal_format"] = ktx_internal
                    tex_dict["ktx_base_format"] = ktx_base
                    tex_dict["data"] = mip_data
                    tex_dict["compressed"] = True

                print(f"SC6: Extracted embedded KTX texture {ktx_width}x{ktx_height}, "
                      f"{mip_size} bytes, internal={ktx_internal:#x}")
            except Exception as e:
                warnings.warn(f"Failed to extract embedded KTX texture: {e}", stacklevel=2)
        elif chunks_end < len(inner):
            for tex_dict in self.textures:
                tex_dict["data"] = bytes(inner[chunks_end:])
                tex_dict["compressed"] = False
            print(f"SC6: No KTX header, using raw tail data ({len(inner) - chunks_end} bytes)")

    def decode_textures(self) -> list[Image.Image | None]:
        """Decode the embedded texture data to RGBA PIL Images.

        Returns a list aligned with self.textures. Returns None for
        textures that fail to decode (caller treats as missing).
        """
        import texture2ddecoder

        images: list[Image.Image | None] = []
        for tex in self.textures:
            data = tex.get("data")
            if not data:
                images.append(None)
                continue
            w = tex["width"]
            h = tex["height"]
            internal = tex.get("ktx_internal_format", 0)

            # GL_COMPRESSED_RGBA_ASTC_8x8_KHR
            if internal == 0x93B7:
                decoded = texture2ddecoder.decode_astc(data, w, h, 8, 8)
                images.append(Image.frombytes("RGBA", (w, h), decoded, "raw", "BGRA"))
            # GL_COMPRESSED_RGBA_ASTC_4x4_KHR
            elif internal == 0x93B0:
                decoded = texture2ddecoder.decode_astc(data, w, h, 4, 4)
                images.append(Image.frombytes("RGBA", (w, h), decoded, "raw", "BGRA"))
            # GL_COMPRESSED_RGB8_ETC2
            elif internal == 0x9274:
                decoded = texture2ddecoder.decode_etc2(data, w, h)
                images.append(Image.frombytes("RGB", (w, h), decoded).convert("RGBA"))
            # GL_COMPRESSED_RGBA8_ETC2_EAC
            elif internal == 0x9278:
                decoded = texture2ddecoder.decode_etc2a8(data, w, h)
                images.append(Image.frombytes("RGBA", (w, h), decoded, "raw", "BGRA"))
            # Raw RGBA8 data (no compression marker)
            elif not tex.get("compressed", False):
                images.append(
                    Image.frombytes("RGBA", (w, h), data)
                )
            else:
                warnings.warn(
                    f"Unsupported texture format 0x{internal:04x} for {self.sc_path}",
                    stacklevel=2,
                )
                images.append(None)
        return images

    # ------------------------------------------------------------------
    def _parse_movie_clip(self, clip: Any) -> None:
        """Parse one MovieClip into internal structures (mirrors SC5File)."""
        mc_id = clip.Id()
        children_ids = [clip.ChildrenIds(j) for j in range(clip.ChildrenIdsLength())]
        children = [{"id": cid} for cid in children_ids]
        child_names: list[str] = []
        for j in range(clip.ChildrenNameRefIdsLength()):
            ref = clip.ChildrenNameRefIds(j)
            if 0 < ref < len(self.strings):
                child_names.append(self.strings[ref])
            else:
                child_names.append("")
        frame_counts: list[int] = []
        frame_labels: list[str] = []
        if clip.FramesLength() > 0:
            for j in range(clip.FramesLength()):
                frame = clip.Frames(j)
                frame_counts.append(frame.UsedTransform())
                lid = frame.LabelRefId()
                label = self.strings[lid] if 0 < lid < len(self.strings) else ""
                frame_labels.append(label)
        elif hasattr(clip, 'ShortFramesLength') and clip.ShortFramesLength() > 0:
            for j in range(clip.ShortFramesLength()):
                sf = clip.ShortFrames(j)
                frame_counts.append(sf.UsedTransform())
                frame_labels.append("")

        children_blending = [clip.ChildrenBlending(j) for j in range(clip.ChildrenBlendingLength())]
        fps = clip.Framerate() or 24

        sg: ScalingGrid | None = None
        sgi = clip.ScalingGridIndex()
        if sgi is not None and 0 <= sgi < len(self._scaling_rects):
            sg = self._scaling_rects[sgi]

        fe_offset = clip.FrameElementsOffset()
        if fe_offset is None:
            fe_offset = _NO_FRAME_ELEMENTS

        self.movie_clip_data[mc_id] = MovieClipData(
            id=mc_id,
            children_ids=children_ids,
            children_names=child_names,
            children_blending=children_blending,
            frame_elements_offset=fe_offset,
            matrix_bank_index=clip.MatrixBankIndex(),
            frame_element_counts=frame_counts,
            frame_labels=frame_labels,
            framerate=fps,
            scaling_grid=sg,
        )
        if hasattr(clip, "CompressedDataOffset"):
            self.movie_clip_data[mc_id].compressed_data_offset = (
                clip.CompressedDataOffset()
            )
        # Decode compressed movieclip frame elements (SC6 effects format).
        # The clip's CompressedDataOffset points into the external matrix
        # bank's clip-data buffer; the data there is the mask/RLE-encoded
        # frame element stream decoded by ExternalMovieClipFrameElementDecoder.
        if (
            fe_offset == _NO_FRAME_ELEMENTS
            and hasattr(clip, "CompressedDataOffset")
        ):
            try:
                cdo = clip.CompressedDataOffset()
                if cdo != 0:
                    bank_idx = clip.MatrixBankIndex()
                    if 0 <= bank_idx < len(self._clip_data_buffers):
                        clip_buf = self._clip_data_buffers[bank_idx]
                        if clip_buf and cdo < len(clip_buf):
                            decoded_frames = _decode_movieclip_frames(clip_buf, cdo)
                            self._decoded_frames[mc_id] = decoded_frames
            except Exception:
                warnings.warn(
                    f"Failed to decode compressed frame data for clip {mc_id}",
                    stacklevel=2,
                )

    def _parse_movie_clips(self, mc: Any) -> None:
        for i in range(mc.MovieclipsLength()):
            self._parse_movie_clip(mc.Movieclips(i))

    # ------------------------------------------------------------------
    # Same API as SC5File — delegates to sc5_parser.render
    # ------------------------------------------------------------------

    def get_frame_elements(self, mc_id: int, frame_idx: int = 0) -> list[FrameElement]:
        mcd = self.movie_clip_data.get(mc_id)
        if mcd is None:
            return []
        # Compressed SC6 frame elements (decoded during parse)
        decoded = self._decoded_frames.get(mc_id)
        if decoded:
            if frame_idx < 0 or frame_idx >= len(decoded):
                return []
            return decoded[frame_idx]
        if not mcd.frame_element_counts:
            return []
        if mcd.frame_elements_offset == _NO_FRAME_ELEMENTS:
            return []
        if frame_idx < 0 or frame_idx >= len(mcd.frame_element_counts):
            return []
        fe = self._frame_elements
        off = mcd.frame_elements_offset
        for fi in range(frame_idx):
            off += mcd.frame_element_counts[fi] * 3
        count = mcd.frame_element_counts[frame_idx]
        result: list[FrameElement] = []
        for k in range(count):
            base = off + k * 3
            if base + 2 >= len(fe):
                break
            result.append(FrameElement(
                child_index=int(fe[base]),
                matrix_index=int(fe[base + 1]),
                color_index=int(fe[base + 2]),
            ))
        return result

    def find_frame_by_label(self, mc_id: int, label: str) -> int:
        mcd = self.movie_clip_data.get(mc_id)
        if mcd is None:
            return 0
        for i, fl in enumerate(mcd.frame_labels):
            if fl == label:
                return i
        return 0

    def get_matrix(self, mc_id: int, matrix_index: int) -> Matrix2x3:
        if matrix_index == _NO_TRANSFORM:
            return Matrix2x3.IDENTITY
        mcd = self.movie_clip_data.get(mc_id)
        bank_idx = mcd.matrix_bank_index if mcd else 0
        if bank_idx < len(self.matrix_banks):
            bank = self.matrix_banks[bank_idx]
            if matrix_index < len(bank):
                return bank[matrix_index]
        return Matrix2x3.IDENTITY

    def get_color(self, mc_id: int, color_index: int) -> ColorTransform:
        if color_index == _NO_TRANSFORM:
            return ColorTransform.IDENTITY
        mcd = self.movie_clip_data.get(mc_id)
        bank_idx = mcd.matrix_bank_index if mcd else 0
        if bank_idx < len(self.color_banks):
            bank = self.color_banks[bank_idx]
            if color_index < len(bank):
                return bank[color_index]
        return ColorTransform.IDENTITY

    # --- Rendering delegation ---

    def find_shapes_for_export(self, export_name: str) -> list[int]:
        from sc5_parser.render import find_shapes_for_export
        return find_shapes_for_export(self, export_name)

    def _collect_shapes(self, obj_id: int, visited: set[int]) -> list[int]:
        from sc5_parser.render import collect_shapes
        return collect_shapes(self, obj_id, visited)

    def _render_shape(
        self,
        shape_idx: int,
        texture_images: list[Image.Image | None],
        transform: tuple[float, float, float, float, float, float] | None = None,
        _tex_arr_cache: dict[int, np.ndarray] | None = None,
    ) -> tuple[Image.Image | None, float, float]:
        from sc5_parser.render import render_shape
        return render_shape(self, shape_idx, texture_images, transform, _tex_arr_cache)

    def render_object(
        self,
        obj_id: int,
        texture_images: list[Image.Image | None],
        parent_matrix: Matrix2x3,
        visited: set[int],
        color: ColorTransform | None = None,
        frame_label: str | None = None,
        depth: int = 0,
        blend_mode: int = 0,
        child_labels: dict[int, str] | None = None,
        frame_index: int | None = None,
        ctx: RenderContext | None = None,
        _tex_arr_cache: dict[int, np.ndarray] | None = None,
    ) -> list[tuple[Image.Image, float, float, int]]:
        from sc5_parser.render import render_object
        return render_object(
            self, obj_id, texture_images, parent_matrix, visited,
            color, frame_label, depth, blend_mode, child_labels,
            frame_index, ctx, _tex_arr_cache,
        )

    def extract_sprite(
        self,
        export_name: str,
        texture_images: list[Image.Image | None],
        output_path: str | Path | None = None,
        frame_label: str | None = None,
        child_labels: dict[int, str] | None = None,
        frame_index: int | None = None,
        ctx: RenderContext | None = None,
    ) -> Image.Image | None:
        from sc5_parser.render import extract_sprite
        return extract_sprite(
            self, export_name, texture_images, output_path,
            frame_label, child_labels, frame_index, ctx,
        )

    def extract_sprite_with_offset(
        self,
        export_name: str,
        texture_images: list[Image.Image | None],
        frame_label: str | None = None,
        child_labels: dict[int, str] | None = None,
        frame_index: int | None = None,
        ctx: RenderContext | None = None,
    ) -> tuple[Image.Image, float, float] | None:
        from sc5_parser.render import extract_sprite_with_offset
        return extract_sprite_with_offset(
            self, export_name, texture_images, frame_label,
            child_labels, frame_index, ctx,
        )

    def get_export_frame_info(self, export_name: str) -> dict[str, Any] | None:
        from sc5_parser.render import get_export_frame_info
        return get_export_frame_info(self, export_name)

    def get_shape_bounds(self, shape_idx: int) -> dict[str, Any] | None:
        from sc5_parser.render import get_shape_bounds
        return get_shape_bounds(self, shape_idx)