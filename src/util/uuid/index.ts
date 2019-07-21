import { rng } from './lib/rng';
import { bytesToUuid } from './lib/bytes-to-uuid';

export function v4() {
    const rnds = rng();

    // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`
    rnds[6] = (rnds[6] & 0x0f) | 0x40;
    rnds[8] = (rnds[8] & 0x3f) | 0x80;

    return bytesToUuid(rnds);
}
