import db, { MODELS } from '../../db';

export function findUserByUserName(username: string): User | void {
    const ids = db.get(MODELS.USER).keys().value();
    for (let i = 0, n = ids.length; i < n; i++) {
        const user = db.get(MODELS.USER).get(ids[i]).value();
        if ((user.name || '').toLowerCase() === username.toLowerCase()) {
            return user as User;
        }
    }
}
