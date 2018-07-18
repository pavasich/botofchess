import db, { MODELS } from '../../db/index';

export const getBalanceForDirtyUser = (user: DirtyUser): number => {
    let balance = db.get(MODELS.CURRENCY).get(user['display-name']).value();
    if (balance !== undefined) {
        return balance;
    }
    balance = db.get(MODELS.CURRENCY).get(user.username).value();
    if (balance !== undefined) {
        return balance;
    }
    return 0;
};

export const decrementBalanceForDirtyUser = (user: DirtyUser, amount: number) => {
    let balance = db.get(MODELS.CURRENCY).get(user['display-name']).value();
    if (balance !== undefined) {
        db.get(MODELS.CURRENCY).set(user['display-name'], balance - amount).write();
        return void 0;
    }
    balance = db.get(MODELS.CURRENCY).get(user.username).value();
    if (balance !== undefined) {
        db.get(MODELS.CURRENCY).set(user.username, balance - amount).write();
    }
};
