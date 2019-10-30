import { second } from '../../../util/time-expand';
import Monologue from '../../../models/Monologue';
import { setState } from '../../../bot/state';
import { trick_or_treat, clear } from '.'

const second30 = second(30);

export default (channel: string, bot: any, speakingFunction: (m: Monologue) => void, forceTreat: boolean = false) => {
    setState({
        tricking: true,
    });
    bot.action(channel, 'hears you knocking.');
    bot.action(channel, 'Hello! What have we here! (talk in chat in the next 30 seconds to be eligible for a trick)');
    setTimeout(() => {
        speakingFunction(trick_or_treat(forceTreat));
        clear();
        setState({ tricking: false });
    }, second30);
};
