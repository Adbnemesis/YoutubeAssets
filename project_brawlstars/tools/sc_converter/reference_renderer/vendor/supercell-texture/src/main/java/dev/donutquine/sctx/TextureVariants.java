package dev.donutquine.sctx;

import java.util.ArrayList;
import java.util.List;

public class TextureVariants {
    private final List<StreamingTexture> streamingTextures;

    public TextureVariants() {
        this.streamingTextures = new ArrayList<>();
    }

    public TextureVariants(List<StreamingTexture> streamingTextures) {
        this.streamingTextures = streamingTextures;
    }

    @Override
    public String toString() {
        return "TextureVariants{" +
            "streamingTextures=" + streamingTextures +
            '}';
    }
}
