import db from '../../db';
import { Model } from '../../db/db-constants';

export enum BalanceAction {
    inc = 'inc',
    dec = 'dec',
    set = 'set',
}

function modify(action: BalanceAction, a: number, b: number) {
    if (action === BalanceAction.set) {
        return b;
    }
    if (action === BalanceAction.dec) {
        return a - b;
    }
    if (action === BalanceAction.inc) {
        return a + b;
    }
    return 'Error: Unknown Command';
}

export function updateBalance(username: string, action: BalanceAction, quantity: number) {
    const balance = db.get(Model.Currency).get(username).value();
    if (balance === undefined) {
        return 'Error: Not Found';
    }
    const result = modify(action, parseInt(balance, 10), quantity);
    if (typeof result === 'number') {
        db.get(Model.Currency).set(username, modify(action, balance, quantity)).write();
        return result;
    }
    return result;
}
