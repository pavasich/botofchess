import db, { MODELS } from '../../db';
import { findUserByUserName } from '../user/find-by-username';

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
    return '500::Ow, my brain';
}

export function updateWallet(username: string, action: BalanceAction, type: keyof Store, quantity: number) {
    const user = findUserByUserName(username);
    if (user === undefined) {
        return `404::${username}`;
    }

    const wallet = db.get(MODELS.TICKETS).get(user.id).value() as Store;
    if (wallet === undefined) {
        return `404::${username} -> wallet`;
    }

    const result = modify(action, wallet[type], quantity);

    if (typeof result === 'number') {
        db.get(MODELS.TICKETS).get(user.id).set(type, result).write();
        return `200::${username}.wallet.${type}=${result}`;
    }

    return result;
}
