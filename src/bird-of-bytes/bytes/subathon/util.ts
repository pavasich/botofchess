
export function toN(n: string) {
    return parseInt(n, 10);
}


const bitsRegex = /(\d+) bits/;
function bitsLogic(s: string) {
    const n = s.replace(bitsRegex, '$1');
    if (n.length > 0) {
        const parsed = toN(n);
        if (parsed === parsed) {
            return parsed / 100;
        }
    }
    return undefined;
}

function donationLogic(s: string) {
    const n = s.replace(/[\sA-z\$]+/, '');
    if (n.length > 0) {
        const parsed = toN(n);
        if (parsed === parsed) {
            return parsed;
        }
    }
    return undefined;
}

const t1s = ['t1', 'tier 1', 'tier one'];
const tier1Regex = /(t1|tier 1|tier one)/gi;
function tier1Logic() {
    return 5;
}

const tier2Regex = /(t2|tier 2|tier two)/gi;
function tier2Logic() {
    return 10;
}

const tier3Regex = /(t3|tier 3|tier three)/gi;
function tier3Logic() {
    return 25;
}


export function logicEngine(s: string) {
    if (/bits/.test(s)) {
        return bitsLogic(s);
    }

    if (/\$|donation|dollars/.test(s)) {
        return donationLogic(s);
    }

    if (tier1Regex.test(s)) {
        return tier1Logic();
    }

    if (tier2Regex.test(s)) {
        return tier2Logic();
    }

    if (tier3Regex.test(s)) {
        return tier3Logic();
    }

    return undefined;
}
