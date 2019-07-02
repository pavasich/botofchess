import Monologue from '../../models/Monologue';
import { pickRand } from '../../util/arrays';
import { coin_sides } from '../../bot/globals';
import { t } from '../../bot/util';

export function flipCoin(name: string) {
    const m = new Monologue();
    m.add(`${name} flips a coin...`);
    m.add(`   ${pickRand(coin_sides)} !`, t.second1);
    return m;
}
