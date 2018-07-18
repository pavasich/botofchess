import low from 'lowdb';
import FileSync from 'lowdb/adapters/FileSync';
import { MODELS } from './db-constants';
import seed from './seed';

const adapter = new FileSync('db.json');
const db = low(adapter);

const defaultValues = {
    [MODELS.USER]: {},
    [MODELS.SHAME]: 0,
    [MODELS.CURRENCY]: {},
    [MODELS.TICKETS]: {},
    ...seed,
};

db.defaults(defaultValues).write();

export default db;
