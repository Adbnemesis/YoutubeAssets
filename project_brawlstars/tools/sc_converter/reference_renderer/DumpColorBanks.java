import dev.donutquine.swf.*;
import java.nio.file.*;

public class Dump {
    public static void main(String[] args) throws Exception {
        if (args.length < 1) { System.out.println("usage: Dump <input.sc>"); return; }
        Path p = Paths.get(args[0]);
        SupercellSWF swf = SupercellSWF.createEmpty();
        boolean ok = swf.load(p.toString(), p.getFileName().toString(), false);
        System.out.println("load=" + ok);
        System.out.println("matrixBanks=" + swf.getMatrixBankCount());
        int[] idxs = {33, 65, 701, 712, 670, 713, 156, 818, 1265, 1361, 45, 951, 1077, 1320, 1075, 952, 756};
        for (int b = 0; b < swf.getMatrixBankCount(); b++) {
            ScMatrixBank bank = swf.getMatrixBank(b);
            System.out.println("BANK " + b + " matrices=" + bank.getMatrixCount() + " colors=" + bank.getColorTransformCount());
            for (int i : idxs) {
                if (i >= bank.getColorTransformCount()) continue;
                ColorTransform c = bank.getColorTransform(i);
                System.out.printf("  c[%d] = mul(%d,%d,%d) a=%d add(%d,%d,%d)%n",
                    i, c.getRedMultiplier(), c.getGreenMultiplier(), c.getBlueMultiplier(),
                    c.getAlpha(), c.getRedAddition(), c.getGreenAddition(), c.getBlueAddition());
            }
        }
    }
}
