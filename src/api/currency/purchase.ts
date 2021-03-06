import db from '../../db';
import { Model } from '../../db/db-constants';
import { getBalanceForDirtyUser, decrementBalanceForDirtyUser } from './balance';
import { sanitizeDirtyUser } from '../../models/User';
import pluralize from '../../util/pluralize';

const prices: Store = {
    ffxiv: 100,
    gw2: 100,
    ticket: 100,
};

const availableForPurchase = new Set(['ffxiv', 'gw2']);

export default (dirtyUser: DirtyUser, amount: number, item: keyof Store) => {
    if (amount <= 0) {
        return 'Ok, then.';
    }
    const balance: number = getBalanceForDirtyUser(dirtyUser);
    const user = sanitizeDirtyUser(dirtyUser);
    if (balance >= 100) {
        if (prices[item] !== undefined && availableForPurchase.has(item)) {
            const request = amount * prices[item];
            if (request <= balance) {
                if (db.get(Model.Tickets).get(user.id).value() === undefined) {
                    db
                        .get(Model.Tickets)
                        .set(user.id, {
                            ffxiv: 0,
                            gw2: 0,
                            ticket: 0,
                        } as Store)
                        .write();
                }
                const bank: Store = db.get(Model.Tickets).get(user.id).value();
                let current: number = bank[item];
                if (current === undefined) {
                    current = 0;
                }
                db.get(Model.Tickets).get(user.id).set(item, current + amount).write();
                decrementBalanceForDirtyUser(dirtyUser, request);
                const sum = current + amount;
                return `Success! You now have ${sum} ticket${pluralize(sum)}.`
            } else {
                return `You can't afford that many. (${request - balance} short)`
            }
        } else {
            return `I don't know what that is.`;
        }
    } else {
        return `You can't afford anything yet.`;
    }
};
