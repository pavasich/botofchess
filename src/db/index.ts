import low from 'lowdb';
import FileSync from 'lowdb/adapters/FileSync';
import { MODELS } from './db-constants';
import seed from './seed';

const adapter = new FileSync('db.json');
const db = low(adapter);

const defaultValues = {
    [MODELS.USER]: {},
    [MODELS.CURRENCY]: {},
    [MODELS.TICKETS]: {},
    [MODELS.LOG]: [],
    ...seed,
};

db.defaults(defaultValues).write();

export { MODELS } from './db-constants';
export default db;
