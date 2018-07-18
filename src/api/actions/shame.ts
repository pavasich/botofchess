import db, { MODELS } from '../../db';
import { getRandomShameQuote } from '../quote/shame-quote';

export default (): string => {
    const quote = getRandomShameQuote();
    const shames = db.get(MODELS.SHAME).value();
    db.set(MODELS.SHAME, shames + 1).write();
    return `Shame #${shames + 1}: ${quote}`;
};
