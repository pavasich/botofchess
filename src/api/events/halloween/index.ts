import Monologue from '../../../models/Monologue';
import * as z from './tricks';

const standard = [...z.standard];
const rare = [...z.rare];
const super_rare = [...z.super_rare];

function pick(array: Array<any>) {
    return array[Math.floor(Math.random() * array.length)];
}

let visitors = new Set();
export function handleMessage(userstate: DirtyUser) {
    visitors.add(userstate.username);
}

export function clear() {
    visitors = new Set();
}

export function trick_or_treat(treatOverride: boolean = false) {
    const list = [...visitors];
    if (list.length === 0) {
        return new Monologue().add('Huh, no one\'s there.');
    }
    const winner = list[Math.floor(Math.random() * list.length)];
    let p = Math.random();
    let prize;
    while (p === 0) {
        p = Math.random();
    }
    if (treatOverride) {
        prize = super_rare[0];
    } else if (p <= 0.02) {
        prize = pick(super_rare);
    } else if (p <= 0.08) {
        prize = pick(rare);
    } else {
        prize = pick(standard);
    }

    return new Monologue()
        .add(`Ah, ${winner}! Hello!`, 1000)
        .add('Let\'s see...what have I got in here...', 3000)
        .add(prize);
}
