export default function pluralize(number: number): string {
    return number === 1
        ? ''
        : 's';
}
