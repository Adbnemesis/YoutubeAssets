package dev.donutquine.utilities;

import java.math.BigInteger;

/**
 * Inspired by <a href="https://github.com/jakedouglas/fnv-java">fnv-java</a>.
 */
public class FnvHasher {
    private static final BigInteger INIT32 = new BigInteger("811c9dc5", 16);
    private static final BigInteger INIT64 = new BigInteger("cbf29ce484222325", 16);
    private static final BigInteger PRIME32 = new BigInteger("01000193", 16);
    private static final BigInteger PRIME64 = new BigInteger("100000001b3", 16);
    private static final BigInteger MOD32 = new BigInteger("2").pow(32);
    private static final BigInteger MOD64 = new BigInteger("2").pow(64);

    private FnvHasher() {}

    public static int fnv1_32(byte[] data) {
        return fnv1(data, INIT32, PRIME32, MOD32).intValue();
    }

    public static int fnv1a_32(byte[] data) {
        return fnv1a(data, INIT32, PRIME32, MOD32).intValue();
    }

    public static long fnv1_64(byte[] data) {
        return fnv1(data, INIT64, PRIME64, MOD64).longValue();
    }

    public static long fnv1a_64(byte[] data) {
        return fnv1a(data, INIT64, PRIME64, MOD64).longValue();
    }

    /**
     * The FNV-0 hash differs from the FNV-1 hash only by the initialisation value of the hash variable. <br>
     * <br>
     * A consequence of initializing the hash to 0 is that empty messages and all messages consisting of only byte 0,
     * regardless of their length, are hashed to 0.
     */
    @Deprecated
    public static BigInteger fnv0(byte[] data, BigInteger prime, BigInteger mod) {
        return fnv1(data, BigInteger.ZERO, prime, mod);
    }

    /**
     * The FNV-0a (own) hash differs from the FNV-1 hash only by the initialisation value of the hash variable. <br>
     * <br>
     * A consequence of initializing the hash to 0 is that empty messages and all messages consisting of only byte 0,
     * regardless of their length, are hashed to 0.
     */
    @Deprecated
    public static BigInteger fnv0a(byte[] data, BigInteger prime, BigInteger mod) {
        return fnv1a(data, BigInteger.ZERO, prime, mod);
    }

    public static BigInteger fnv1(byte[] data, BigInteger init, BigInteger prime, BigInteger mod) {
        BigInteger hash = init;

        for (byte b : data) {
            hash = hash.multiply(prime).mod(mod);
            hash = hash.xor(BigInteger.valueOf((int) b & 0xff));
        }

        return hash;
    }

    /**
     * The FNV-1a hash differs from the FNV-1 hash only by the order in which the multiply and XOR is performed,
     * which leads to slightly better avalanche characteristics.
     */
    public static BigInteger fnv1a(byte[] data, BigInteger init, BigInteger prime, BigInteger mod) {
        BigInteger hash = init;

        for (byte b : data) {
            hash = hash.xor(BigInteger.valueOf((int) b & 0xff));
            hash = hash.multiply(prime).mod(mod);
        }

        return hash;
    }
}
