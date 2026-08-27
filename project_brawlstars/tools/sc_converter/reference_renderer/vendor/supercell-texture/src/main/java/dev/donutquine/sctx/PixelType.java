package dev.donutquine.sctx;

import java.util.Map;
import java.util.TreeMap;

/**
 * The types taken from <a href="https://github.com/sc-workshop/SupercellTexture/blob/main/supercell-texture/source/texture/backend/Supercell/ScPixel.hpp">ScPixel</a>.
 */
public enum PixelType {
    NONE(0),

    // TODO: 42, 43, 40

    UNCOMPRESSED(70),

    EAC_R11(170),
    EAC_SIGNED_R11(172),
    EAC_RG11(174),
    EAC_SIGNED_RG11(176),
    ETC2_EAC_RGBA8(178),
    ETC2_EAC_SRGBA8(179),
    ETC2_RGB8(180),
    ETC2_SRGB8(181),
    ETC2_RGB8_PUNCHTHROUGH_ALPHA1(182),
    ETC2_SRGB8_PUNCHTHROUGH_ALPHA1(183),

    ASTC_SRGBA8_4x4(186),
    ASTC_SRGBA8_5x4(187),
    ASTC_SRGBA8_5x5(188),
    ASTC_SRGBA8_6x5(189),
    ASTC_SRGBA8_6x6(190),
    ASTC_SRGBA8_8x5(192),
    ASTC_SRGBA8_8x6(193),
    ASTC_SRGBA8_8x8(194),
    ASTC_SRGBA8_10x5(195),
    ASTC_SRGBA8_10x6(196),
    ASTC_SRGBA8_10x8(197),
    ASTC_SRGBA8_10x10(198),
    ASTC_SRGBA8_12x10(199),
    ASTC_SRGBA8_12x12(200),

    ASTC_RGBA8_4x4(204),
    ASTC_RGBA8_5x4(205),
    ASTC_RGBA8_5x5(206),
    ASTC_RGBA8_6x5(207),
    ASTC_RGBA8_6x6(208),
    ASTC_RGBA8_8x5(210),
    ASTC_RGBA8_8x6(211),
    ASTC_RGBA8_8x8(212),
    ASTC_RGBA8_10x5(213),
    ASTC_RGBA8_10x6(214),
    ASTC_RGBA8_10x8(215),
    ASTC_RGBA8_10x10(216),
    ASTC_RGBA8_12x10(217),
    ASTC_RGBA8_12x12(218),

    ETC1_RGB8(263),
    ETC1_LUMINANCE(264),
    ETC1_LUMINANCE_ALPHA(265),
    ;

    private static final Map<Integer, PixelType> intToTypeMap;

    static {
        intToTypeMap = new TreeMap<>();

        for (PixelType value : values()) {
            intToTypeMap.put(value.type, value);
        }
    }

    private final int type;

    PixelType(int type) {
        this.type = type;
    }

    public int getType() {
        return type;
    }

    public static PixelType getByType(int type) {
        PixelType pixelType = intToTypeMap.get(type);
        if (pixelType == null) throw new AssertionError("Unknown type: " + type);
        return pixelType;
    }
}
