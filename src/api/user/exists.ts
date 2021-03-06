import { sanitizeDirtyUser } from '../../models/User';
import db from '../../db';
import { Model } from '../../db/db-constants';

const exists = (user: User): boolean =>
    db.get(Model.User).get(user.id).value() !== undefined;

export const dirtyUserExists = (dirtyUser: DirtyUser): boolean =>
    exists(sanitizeDirtyUser(dirtyUser));

export default exists;
