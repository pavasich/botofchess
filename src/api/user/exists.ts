import User, { sanitizeDirtyUser } from '../../models/User';
import DirtyUser from '../../models/DirtyUser';
import db from '../../db';
import { MODELS } from '../../db/db-constants';

const exists = (user: User): boolean =>
    db.get(MODELS.USER).get(user.id).value() !== undefined;

export const dirtyUserExists = (dirtyUser: DirtyUser): boolean =>
    exists(sanitizeDirtyUser(dirtyUser));

export default exists;
