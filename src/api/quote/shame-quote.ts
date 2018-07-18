import db, { MODELS } from '../../db';
import { pickRand } from '../../util/arrays';

export const getRandomShameQuote = () => pickRand(db.get(MODELS.SHAME_QUOTE).value());

