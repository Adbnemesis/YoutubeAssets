import dev.donutquine.editor.assets.SupercellSWFAssetFile;
import dev.donutquine.editor.assets.SupercellSWFAssetFileLoader;
import dev.donutquine.editor.assets.exceptions.AssetLoadingException;
import dev.donutquine.editor.cli.CliGLEventListener;
import dev.donutquine.editor.renderer.Framebuffer;
import dev.donutquine.editor.renderer.impl.EditorStage;
import dev.donutquine.editor.renderer.impl.RendererHelper;
import dev.donutquine.math.ReadonlyRect;
import dev.donutquine.math.Rect;
import dev.donutquine.renderer.impl.swf.objects.DisplayObject;
import dev.donutquine.renderer.impl.swf.objects.MovieClip;
import dev.donutquine.swf.ColorTransform;
import dev.donutquine.swf.Export;
import dev.donutquine.swf.Matrix2x3;
import com.jogamp.opengl.GLCapabilities;
import com.jogamp.opengl.GLDrawableFactory;
import com.jogamp.opengl.GLOffscreenAutoDrawable;
import com.jogamp.opengl.GLProfile;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;

public class BatchRender {
    public static void main(String[] args) throws Exception {
        System.setProperty("java.awt.headless", "true");
        Path input = Paths.get(args[0]);
        Path outputDir = Paths.get(args[1]);
        float pixelSize = Float.parseFloat(args[2]);
        List<String> exports = new ArrayList<>();
        for (int i = 3; i < args.length; i++) exports.add(args[i]);

        GLProfile profile = GLProfile.get(GLProfile.GL3);
        GLCapabilities caps = new GLCapabilities(profile);
        caps.setOnscreen(false);
        caps.setFBO(true);
        GLDrawableFactory factory = GLDrawableFactory.getFactory(profile);
        GLOffscreenAutoDrawable drawable = factory.createOffscreenAutoDrawable(null, caps, null, 256, 256);
        drawable.addGLEventListener(new CliGLEventListener());
        drawable.display();

        try {
            SupercellSWFAssetFile assetFile = (SupercellSWFAssetFile) new SupercellSWFAssetFileLoader(input).load();
            drawable.display();

            EditorStage stage = EditorStage.getInstance();
            boolean preserveCenter = true;

            for (String exportName : exports) {
                DisplayObject displayObject = null;
                for (Export exp : assetFile.asset.getExports()) {
                    if (exportName.equals(exp.name())) {
                        displayObject = assetFile.getOrCreate(exp.id(), exp.name());
                        break;
                    }
                }
                if (displayObject == null) {
                    System.out.println("MISSING EXPORT " + exportName);
                    continue;
                }

                Rect bounds = RendererHelper.getRenderBounds(stage.calculateBoundsForAllFrames(displayObject), preserveCenter);
                bounds.scale(pixelSize);
                ReadonlyRect ceilBounds = RendererHelper.roundBounds(bounds, false);
                int w = (int) Math.ceil(ceilBounds.getWidth());
                int h = (int) Math.ceil(ceilBounds.getHeight());

                Matrix2x3 matrix = new Matrix2x3();
                matrix.scaleMultiply(pixelSize, pixelSize);

                Path partDir = outputDir.resolve(exportName);
                Files.createDirectories(partDir);

                int frameCount;
                boolean isClip = displayObject instanceof MovieClip;
                if (isClip) {
                    MovieClip mc = (MovieClip) displayObject;
                    frameCount = mc.getFrameCount() > 1 ? mc.getFrameCount() : mc.getFrameCountRecursive();
                } else {
                    frameCount = 1;
                }

                System.out.println(exportName + " frames=" + frameCount + " size=" + w + "x" + h);

                for (int f = 0; f < frameCount; f++) {
                    try {
                        Path out = partDir.resolve(String.format("frame_%04d.png", f));
                        if (isClip) {
                            MovieClip mc = (MovieClip) displayObject;
                            mc.gotoAbsoluteTimeRecursive((long) f * mc.getMsPerFrame());
                            mc.setFrame(f);
                        }
                        final int fw = w, fh = h;
                        final ReadonlyRect fb = ceilBounds;
                        final DisplayObject dobj = displayObject;
                        final Matrix2x3 m = matrix;
                        final Path fout = out;
                        final int fnum = f;
                        stage.doInRenderThread(() -> {
                            try {
                                Framebuffer framebuffer = RendererHelper.prepareStageForRendering(stage, fw, fh, fb, 0, 0);
                                RendererHelper.exportAsImage(dobj, m, new ColorTransform(), fout, framebuffer);
                            } catch (Throwable t) {
                                System.out.println("  frame " + fnum + " render error: " + t);
                            }
                        });
                        drawable.display();
                    } catch (Throwable t) {
                        System.out.println("  frame " + f + " error: " + t);
                    }
                }
            }
        } finally {
            drawable.destroy();
        }
    }
}
