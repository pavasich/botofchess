import { sanitizeDirtyUser } from '../../models/User';
import db, { MODELS } from '../../db';

const exists = (user: User): boolean =>
    db.get(MODELS.USER).get(user.id).value() !== undefined;

export const dirtyUserExists = (dirtyUser: DirtyUser): boolean =>
    exists(sanitizeDirtyUser(dirtyUser));

export default exists;
