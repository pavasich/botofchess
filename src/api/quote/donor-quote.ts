import { donor } from './source/donor';
import { pickRand } from '../../util/arrays';

export const getRandomDonorQuote = () => pickRand(donor);

