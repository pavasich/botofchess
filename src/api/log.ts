import db from '../db';
import { Model } from '../db/db-constants';

export default (message: string) => {
    db.get(Model.Log).push(message).write();
};
