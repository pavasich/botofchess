import db from '../../db';
import { Model } from '../../db/db-constants';

export const getBalanceForDirtyUser = (user: DirtyUser): number => {
    let balance = db.get(Model.Currency).get(user['display-name']).value();
    if (balance !== undefined) {
        return balance;
    }
    balance = db.get(Model.Currency).get(user.username).value();
    if (balance !== undefined) {
        return balance;
    }
    return 0;
};

export const decrementBalanceForDirtyUser = (user: DirtyUser, amount: number) => {
    let balance = db.get(Model.Currency).get(user['display-name']).value();
    if (balance !== undefined) {
        db.get(Model.Currency).set(user['display-name'], balance - amount).write();
        return;
    }
    balance = db.get(Model.Currency).get(user.username).value();
    if (balance !== undefined) {
        db.get(Model.Currency).set(user.username, balance - amount).write();
    }
};

export const getTicketsForDirtyUser = (user: DirtyUser): Store => {
    let wallet: Store = db.get(Model.Tickets).get(user['user-id']).value();
    if (wallet === undefined) {
        wallet = {
            ffxiv: 0,
            gw2: 0,
            ticket: 0,
        };
        db.get(Model.Tickets).set(user['user-id'], wallet);
    }
    return wallet;
};
