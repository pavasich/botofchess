const a = 1000;
const b = a * 60;
const c = b * 60;

export function second(seconds: number) {
    return seconds * a;
}

export function minute(minutes: number) {
    return minutes * b;
}

export function hour(hours: number) {
    return hours * c;
}
