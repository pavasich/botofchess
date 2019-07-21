import { sanitizeDirtyUser } from '../../models/User';
import db from '../../db';
import { Model } from '../../db/db-constants';
import exists from './exists';

const update = (user: User): boolean => {
    try {
        if (exists(user)) {
            db.get(Model.User).get(user.id).assign(user).set('lastUpdated', Date.now()).write();
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
