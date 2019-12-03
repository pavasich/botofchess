import getQuote from './get-quote';
import distributeCurrency, { setCurrencyMultiplier, getCurrencyMultiplier } from './distribute-currency';
import shame from './shame';
import { setReminder, clearReminder } from './reminder';

export default {
    getQuote,
    distributeCurrency,
    getCurrencyMultiplier,
    setCurrencyMultiplier,
    shame,
    setReminder,
    clearReminder,
};
