import { quotes } from './source/quote';
import { pick } from '../../util/arrays';

export const getRandomQuote = () => pick(quotes);

