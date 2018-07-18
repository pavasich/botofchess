import db from '../../db';
import { MODELS } from '../../db/db-constants';
import { pickRand } from '../../util/arrays';

export const getRandomQuote = () => pickRand(db.get(MODELS.QUOTE).value());

