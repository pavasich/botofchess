import { sanitizeDirtyUser } from '../../models/User';
import db, { MODELS } from '../../db';
import exists from './exists';

const update = (user: User): boolean => {
    try {
        if (exists(user)) {
            db.get(MODELS.USER).get(user.id).assign(user).set('lastUpdated', Date.now()).write();
            return true;
        }
    } catch (e) {
        return false;
    }
    return false;
};

export const updateFromDirtyUser = (dirtyUser: DirtyUser): boolean =>
    update(sanitizeDirtyUser(dirtyUser));

export default update;
