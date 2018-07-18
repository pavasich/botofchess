import db, { MODELS } from '../db';

export default (message: string) => {
    db.get(MODELS.LOG).push(message).write();
};
