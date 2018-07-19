import db, { MODELS } from '../../db';
import { getBalanceForDirtyUser, decrementBalanceForDirtyUser } from './balance';
import { sanitizeDirtyUser } from '../../models/User';

const prices: Store = {
    ffxiv: 100,
    gw2: 100,
};

export default (dirtyUser: DirtyUser, amount: number, item: keyof Store) => {
    if (amount <= 0) {
        return 'Ok, then.';
    }
    const balance: number = getBalanceForDirtyUser(dirtyUser);
    const user = sanitizeDirtyUser(dirtyUser);
    if (balance >= 100) {
        if (prices[item] !== undefined) {
            const request = amount * prices[item];
            if (request <= balance) {
                if (db.get(MODELS.TICKETS).get(user.id).value() === undefined) {
                    db
                        .get(MODELS.TICKETS)
                        .set(user.id, {
                            ffxiv: 0,
                            gw2: 0,
                        })
                        .write();
                }
                const current: number = db.get(MODELS.TICKETS).get(user.id).get(item).value();
                db.get(MODELS.TICKETS).get(user.id).set(item, current + amount).write();
                decrementBalanceForDirtyUser(dirtyUser, request);
                const s = current + amount === 1
                    ? ''
                    : 's';
                return `Success! You now have ${current + amount} ${item} ticket${s}.`
            } else {
                return `You can't afford that many. (${request - balance} short)`
            }
        } else {
            return `I don't know what that is.`;
        }
    } else {
        return `You can't afford anything yet`;
    }
};
