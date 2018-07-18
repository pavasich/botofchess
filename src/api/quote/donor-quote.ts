import db, { MODELS } from '../../db';
import { pickRand } from '../../util/arrays';

export const getRandomDonorQuote = () => pickRand(db.get(MODELS.DONOR_QUOTE).value());

