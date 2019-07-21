import { randomBytes } from 'crypto';

export function rng() {
    return randomBytes(16);
}
