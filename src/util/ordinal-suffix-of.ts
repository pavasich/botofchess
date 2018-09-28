export default function ordinal(n: number) {
    if (n === undefined) return n;
    if (n === 1) return '1st';
    if (n === 2) return '2nd'
    const s = `${n}`;
    const last = s[s.length - 1];
    if (n > 1 && last === '1')
}
