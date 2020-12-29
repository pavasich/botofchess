import low from 'lowdb';
import FileSync from 'lowdb/adapters/FileSync';
import { Model } from './db-constants';
import seed from './seed';

const adapter = new FileSync('db.json');
const db = low(adapter);

const defaultValues = {
    [Model.User]: {},
    [Model.Currency]: {},
    [Model.Tickets]: {},
    [Model.Log]: [],
    [Model.Channel_Points]: {},
    ...seed,
};

db.defaults(defaultValues).write();

export default db;
