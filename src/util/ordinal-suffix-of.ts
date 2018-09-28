export default function ordinalSuffixOf(n: number) {
    if (n === undefined) return n;
    const tens = n % 10;
    const hundreds = n % 100;
    if (tens == 1 && hundreds != 11) {
        return 'st';
    }
    if (tens == 2 && hundreds != 12) {
        return 'nd';
    }
    if (tens == 3 && hundreds != 13) {
        return 'rd';
    }
    return 'th';
}
