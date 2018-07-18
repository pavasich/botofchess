import Monologue from '../../models/Monologue';
import { getRandomQuote } from '../quote/quote';
import { getRandomDonorQuote } from '../quote/donor-quote';

export default (isDonorQuote: boolean = false): Monologue => {
  const quote = isDonorQuote
    ? getRandomDonorQuote()
    : getRandomQuote();
  const monologue = new Monologue();
  monologue.add(`   "${quote[0]}" - ${quote[1]}, ${quote[2]}`);
  return monologue;
};
