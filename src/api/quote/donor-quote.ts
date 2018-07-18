import db from '../../db';
import { MODELS } from '../../db/db-constants';
import { pickRand } from '../../util/arrays';

export const getRandomDonorQuote = () => pickRand(db.get(MODELS.DONOR_QUOTE).value());

