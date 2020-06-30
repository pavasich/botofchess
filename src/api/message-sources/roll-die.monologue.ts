import Monologue from '../../models/Monologue';
import { second } from '../../util/time-expand';


const multiple = /^\d+d\d+$/;
const single = /^\d+$/;
const delay = second(1.5);


function add(a: number, b: number) {
    return a + b;
}


function roll(sides: number) {
    return Math.ceil(Math.random() * sides);
}


function results(rolls: number[]) {
    if ((rolls.length > 7) || (`${Math.max(...rolls)}`.length > 7)) {
        return '';
    }
    return ` (${rolls.join(', ')})`;
}


export default function rollDie(username: string, dirtyRollToken: string = ''): Monologue|void {
    // prevent stupid things
    const size = dirtyRollToken.length;
    if (size > 20 || size === 0) {
        return;
    }

    const rollToken = dirtyRollToken;

    const isMulti = multiple.test(rollToken);
    const rolls = [];

    let count = 1;
    let sides = 0;

    if (isMulti) {
        let [sCount, sSides] = rollToken.split('d');
        count = parseInt(sCount, 10);
        sides = parseInt(sSides, 10);

    } else if (single.test(rollToken)) {
        sides = parseInt(rollToken);
    } else {
        return;
    }

    // prevent more stupid things
    if (count > Number.MAX_SAFE_INTEGER || sides > Number.MAX_SAFE_INTEGER) {
        return;
    }

    for (let i = 0; i < count; i++) {
        rolls.push(roll(sides));
    }

    const result = rolls.reduce(add);

    if (result === result) {
        const monologue = new Monologue();
        if (isMulti) {
            monologue
                .add(`${username} rolls ${count} d${sides}...`)
                .add(`${result} !${results(rolls)}`, delay)
        } else {
            monologue
                .add(`${username} rolls a d${sides}...`)
                .add(`     ${result} !`, delay);
        }

        return monologue;
    }
    return;
}
