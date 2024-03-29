import { second } from '../../../util/time-expand';
import Monologue from '../../../models/Monologue';
import { setState } from '../../../bot/state';
import { pick } from '../../../util/arrays';
import { trick_or_treat, clear } from '.'

const comments = [
    'Well aren\'t you adorable!',
    'What are you supposed to be...?',
    'Wow, a tiger!',
    'BOO!',
    'Can you guess what I am? Please tell me. I don\'t understand what\'s happening.',
    'Hello! What have we here!',
    'Can I paint your face?',
    'Are you staying hydrated?',
    'Who wants some raisins?!',
    'I ate all the candy...',
    'Do you have any idea what time it is?!',
    'WHO DARES?',
    'Omae Wa Mou Shindeiru',
    'It\'ll be years before you can face me.',
    'Before you ask, no. I don\'t dream of electric sheep. I don\'t dream at all.',
    '........NANI?!',
];

const second30 = second(30);

export default (channel: string, bot: any, speakingFunction: (m: Monologue) => void, forceTreat: boolean = false) => {
    setState({
        tricking: true,
    });
    bot.me(channel, 'hears you knocking.');
    bot.me(channel, `${pick(comments)} (chat within 30s to participate)`);
    setTimeout(() => {
        speakingFunction(trick_or_treat(forceTreat));
        clear();
        setState({ tricking: false });
    }, second30);
};
