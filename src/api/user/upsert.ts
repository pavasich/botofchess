import { sanitizeDirtyUser } from '../../models/User';
import create from './create';
import update from './update';
import exists from './exists';

const upsert = (user: User): void => {
    if (exists(user)) {
        update(user);
    } else {
        create(user);
    }
};

export const upsertFromDirtyUser = (dirtyUser: DirtyUser): void => {
    upsert(sanitizeDirtyUser(dirtyUser));
};

export default upsert;
