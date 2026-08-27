package dev.donutquine.sctx;

import com.supercell.texture.TextureData;
import dev.donutquine.utilities.EnumSetHelper;

import java.util.ArrayList;
import java.util.EnumSet;
import java.util.List;

public class SctxTexture {
    private final TextureVariants textureVariants;
    private final EnumSet<Flags> flags;

    private List<MipMapData> mipMaps;

    private PixelType pixelType;
    private int width, height;

    public SctxTexture(TextureData textureData) {
        this.pixelType = PixelType.getByType(textureData.pixelType());
        this.width = textureData.width();
        this.height = textureData.height();
        this.flags = EnumSetHelper.getEnumSetFromFlags(Flags.class, textureData.flags());

        if (textureData.variants() != null) {
            assert textureData.variants().streamingTexturesLength() == textureData.variants().streamingIdsLength() : "FIXME: My assumption about streaming textures was wrong";
            List<StreamingTexture> streamingTextures = new ArrayList<>();
            for (int i = 0; i < textureData.variants().streamingIdsLength(); i++) {
                int id = textureData.variants().streamingIds(i);
                // Note: var used to avoid ugly explicit type
                var streamingTexture = textureData.variants().streamingTextures(i);

                byte[] streamingTextureData = new byte[streamingTexture.dataLength()];
                streamingTexture.dataAsByteBuffer().get(streamingTextureData);
                streamingTextures.add(new StreamingTexture(id, PixelType.getByType(streamingTexture.pixelType()), streamingTexture.width(), streamingTexture.height(), streamingTextureData));
            }

            this.textureVariants = new TextureVariants(streamingTextures);
        } else {
            this.textureVariants = null;
        }
    }

    public int getWidth() {
        return width;
    }

    public int getHeight() {
        return height;
    }

    public PixelType getPixelType() {
        return pixelType;
    }

    public TextureVariants getTextureVariants() {
        return textureVariants;
    }

    public EnumSet<Flags> getFlags() {
        return flags;
    }

    public List<MipMapData> getMipMaps() {
        return mipMaps;
    }

    public void setMipMaps(List<MipMapData> mipMaps) {
        this.mipMaps = mipMaps;
    }

    // TODO:
    // public void generateMipMaps() {
    //     this.mipMaps = new ArrayList<>();
    // }

    @Override
    public String toString() {
        return "SctxTexture{" +
            "width=" + width +
            ", height=" + height +
            ", pixelType=" + pixelType +
            ", flags=" + flags +
            ", mipMaps=" + mipMaps +
            ", textureVariants=" + textureVariants +
            '}';
    }

    public enum Flags {
        IS_COMPRESSED,
        UNK2,
        UNK3,
        USE_PADDING;

        public long getMask() {
            return 1L << ordinal();
        }
    }
}
