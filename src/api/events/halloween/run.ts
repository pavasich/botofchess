import { second } from '../../../util/time-expand';
import { trick_or_treat, clear } from '.'
import Monologue from '../../../models/Monologue';

const second30 = second(30);

export default (channel: string, bot: any, speakingFunction: (m: Monologue) => void) => {
    let tricking;
    return () => {
        tricking = true;
        bot.action(channel, 'hears you knocking.');
        bot.action(channel, 'Hello! What have we here! (talk in chat in the next 30 seconds to be eligible for a trick)');
        setTimeout(() => {
            speakingFunction(trick_or_treat());
            clear();
            tricking = false;
        }, second30);
    }
};
