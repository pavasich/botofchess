import db, { MODELS } from '../../db';
import { pickRand } from '../../util/arrays';

export const getRandomQuote = () => pickRand(db.get(MODELS.QUOTE).value());

