package dev.donutquine.utilities;

import java.util.BitSet;
import java.util.EnumSet;
import java.util.stream.Collectors;

public class EnumSetHelper {
    private EnumSetHelper() {}

    /// Thanks to <a href="https://stackoverflow.com/a/44573504/14915825">fps from StackOverflow</a>
    public static <T extends Enum<T>> EnumSet<T> getEnumSetFromFlags(Class<T> enumType, long flags) {
        T[] values = enumType.getEnumConstants();

        return BitSet.valueOf(new long[] {flags}).stream()
//            .filter(n -> n < values.length) // bounds check
            .mapToObj(n -> values[n])
            .collect(Collectors.toCollection(() -> EnumSet.noneOf(enumType)));
    }
}
