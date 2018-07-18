import db from '../../db';
import { MODELS } from '../../db/db-constants';
import { pickRand } from '../../util/arrays';

export const getRandomShameQuote = () => pickRand(db.get(MODELS.SHAME_QUOTE).value());

