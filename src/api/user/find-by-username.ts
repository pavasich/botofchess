import db from '../../db';
import { Model } from '../../db/db-constants';

export function findUserByUserName(username: string): User | void {
    const ids = db.get(Model.User).keys().value();
    for (let i = 0, n = ids.length; i < n; i++) {
        const user = db.get(Model.User).get(ids[i]).value();
        if ((user.name || '').toLowerCase() === username.toLowerCase()) {
            return user as User;
        }
    }
}
