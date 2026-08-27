package dev.donutquine.sctx;

import java.io.IOException;
import java.io.InputStream;

public interface SctxTextureLoader {
    SctxTexture load(InputStream inputStream) throws IOException;
}
