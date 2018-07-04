import quotes from '../quotes';
import donorQuotes from '../donor-quotes';
import Monologue from './Monologue';

const getRandomEntryFrom = (array) =>
  array[Math.floor(Math.random() * array.length)];

export default (isDonorQuote = false) => {
  const array = isDonorQuote
    ? donorQuotes
    : quotes;
  const quote = getRandomEntryFrom(array);
  const monologue = new Monologue();
  monologue.add(`   "${quote[0]}" - ${quote[1]}, ${quote[2]}`);
  return monologue;
};
