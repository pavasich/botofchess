import db from '../../db';
import { Model } from '../../db/db-constants';
import { getRandomShameQuote } from '../quote/shame-quote';

export default (): string => {
    const quote = getRandomShameQuote();
    const shames = db.get(Model.Shame).value();
    db.set(Model.Shame, shames + 1).write();
    return `Shame #${shames + 1}: ${quote}`;
};
