import { quotes } from '../../globals';
import donorQuotes from '../../donor-quotes';
import Monologue from '../../models/Monologue';
import { pickRand } from '../../util/arrays';

export default (isDonorQuote: boolean = false): Monologue => {
  const array = isDonorQuote
    ? donorQuotes
    : quotes;
  const quote = pickRand(array);
  const monologue = new Monologue();
  monologue.add(`   "${quote[0]}" - ${quote[1]}, ${quote[2]}`);
  return monologue;
};
