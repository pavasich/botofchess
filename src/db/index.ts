import low from 'lowdb';
import FileSync from 'lowdb/adapters/FileSync';
import { MODELS } from './db-constants';

const adapter = new FileSync('db.json');
const db = low(adapter);

const defaultValues = {
    [MODELS.USER]: {},
    [MODELS.SHAME]: 0,
};

db.defaults(defaultValues).write();

export default db;
