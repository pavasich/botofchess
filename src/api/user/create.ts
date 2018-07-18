import { sanitizeDirtyUser } from '../../models/User';
import db, { MODELS } from '../../db';
import exists from './exists';

const create = (user: User): boolean => {
    try {
        if (exists(user)) return false;
        const newUser = {
            ...user,
            lastUpdated: Date.now(),
        };
        db
            .get(MODELS.USER)
            .set(newUser.id, newUser)
            .write();
        return true;
    } catch (e) {
        return false;
    }
};

export const createFromDirtyUser = (dirtyUser: DirtyUser): boolean =>
    create(sanitizeDirtyUser(dirtyUser));

export default create;
