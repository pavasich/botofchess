import { quotes } from './source/quote';
import { pickRand } from '../../util/arrays';

export const getRandomQuote = () => pickRand(quotes);

