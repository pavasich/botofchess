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


function tier1Logic() {
    return 5;
}

function tier2Logic() {
    return 10;
}

function tier3Logic() {
    return 25;
}


export function logicEngine(s: string) {
    if (/t1|tier 1|tier one/.test(s)) {
        return tier1Logic();
    }

    if (/t2|tier 2|tier two/.test(s)) {
        return tier2Logic();
    }

    if (/t3|tier 3|tier three/.test(s)) {
        return tier3Logic();
    }

    if (/bits/.test(s)) {
        return bitsLogic(s);
    }

    if (/\$|donation|dollars/.test(s)) {
        return donationLogic(s);
    }

    return undefined;
}
