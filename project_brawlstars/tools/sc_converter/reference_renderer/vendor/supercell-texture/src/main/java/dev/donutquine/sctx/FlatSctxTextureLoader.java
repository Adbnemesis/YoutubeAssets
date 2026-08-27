package dev.donutquine.sctx;

import com.supercell.texture.TextureData;
import dev.donutquine.swf.file.compression.Zstandard;
import dev.donutquine.utilities.FnvHasher;

import java.io.IOException;
import java.io.InputStream;
import java.nio.ByteBuffer;
import java.nio.ByteOrder;
import java.util.ArrayList;
import java.util.List;

import static com.supercell.texture.MipMapData.getRootAsMipMapData;
import static com.supercell.texture.TextureData.getRootAsTextureData;

public final class FlatSctxTextureLoader implements SctxTextureLoader {
    private static final boolean VALIDATE_MIP_MAP_HASH = true;

    private static final FlatSctxTextureLoader INSTANCE = new FlatSctxTextureLoader();

    public static FlatSctxTextureLoader getInstance() {
        return INSTANCE;
    }

    private FlatSctxTextureLoader() { }

    public SctxTexture load(InputStream inputStream) throws IOException {
        byte[] data = inputStream.readAllBytes();

        ByteBuffer buffer = ByteBuffer.wrap(data);
        buffer.order(ByteOrder.LITTLE_ENDIAN);

        TextureData textureData = getRootAsTextureData(getChunkBytes(buffer));
        ByteBuffer mipMapBuffer = getChunkBytes(buffer);

        if ((textureData.flags() & SctxTexture.Flags.USE_PADDING.getMask()) != 0) {
            buffer.position((buffer.position() + 15) & ~15);
        }

        ByteBuffer textureDataBuffer;
        if ((textureData.flags() & SctxTexture.Flags.IS_COMPRESSED.getMask()) != 0) {
            textureDataBuffer = ByteBuffer.wrap(Zstandard.decompress(data, buffer.position()));
        } else {
            textureDataBuffer = buffer;
        }

        List<com.supercell.texture.MipMapData> tempMipMaps = deserializeMipMaps(mipMapBuffer, textureData);
        List<MipMapData> mipMaps = wrapMipMaps(tempMipMaps, textureDataBuffer);

        SctxTexture sctxTexture = new SctxTexture(textureData);
        sctxTexture.setMipMaps(mipMaps);
        return sctxTexture;
    }

    private static List<com.supercell.texture.MipMapData> deserializeMipMaps(ByteBuffer mipMapBuffer, TextureData textureData) {
        List<com.supercell.texture.MipMapData> mipMaps = new ArrayList<>(textureData.levelCount());
        for (int i = 0; i < textureData.levelCount(); i++) {
            mipMaps.add(getRootAsMipMapData(getChunkBytes(mipMapBuffer)));
        }

        return mipMaps;
    }

    private static List<MipMapData> wrapMipMaps(List<com.supercell.texture.MipMapData> tempMipMaps, ByteBuffer textureDataBuffer) {
        List<MipMapData> mipMaps = new ArrayList<>(tempMipMaps.size());
        for (int i = 0; i < tempMipMaps.size(); i++) {
            var mipMapData = tempMipMaps.get(i);

            int dataLength = textureDataBuffer.remaining();
            var nextMipMapData = i < tempMipMaps.size() - 1 ? tempMipMaps.get(i + 1) : null;
            if (nextMipMapData != null) {
                dataLength = nextMipMapData.offset() - mipMapData.offset();
            }

            byte[] textureData = new byte[dataLength];
            textureDataBuffer.get(textureData);

            if (mipMapData.hashLength() > 0 && VALIDATE_MIP_MAP_HASH) {
                long computedHash = FnvHasher.fnv1a_64(textureData);

                assert mipMapData.hashLength() == 8 : "Unsupported hash used in mip map";

                long hashLong = mipMapData.hashAsByteBuffer().getLong();

                if (hashLong != computedHash) {
                    throw new IllegalStateException("Mipmap hash mismatch");
                }
            }

            mipMaps.add(new MipMapData(mipMapData.width(), mipMapData.height(), textureData));
        }

        return mipMaps;
    }

    private static ByteBuffer getChunkBytes(ByteBuffer byteBuffer) {
        int length = byteBuffer.getInt();
        byte[] bytes = new byte[length];
        byteBuffer.get(bytes);
        return ByteBuffer.wrap(bytes).order(ByteOrder.LITTLE_ENDIAN);
    }
}