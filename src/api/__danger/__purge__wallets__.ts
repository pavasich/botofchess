import db from '../../db';
import { Model } from '../../db/db-constants';

function emptyStore(): Store {
    return {
        gw2: 0,
        ffxiv: 0,
        ticket: 0,
    };
}

export function __purge__wallets__() {
    try {
        db.get(Model.Tickets).keys().forEach(function (key) {
            db.get(Model.Tickets).set(key, emptyStore()).write();
        }).write();
        return '200::Everything is gone. The world is barren. What have I done.'
    } catch (e) {
        return '500::Ow, my brain'
    }
}
