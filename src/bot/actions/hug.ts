import { find } from 'lodash/fp';
import { fetchChatters } from '../../api/user/fetch-chatters';

export default async (userstate: DirtyUser, huggee: string) => {
    if (huggee && huggee !== 'undefined') {
        try {
            const hugger = userstate.username.replace('@', '').toLowerCase();
            huggee = huggee.replace('@', '').toLowerCase();

            if (hugger === huggee) {
                return`@${hugger} is wrapped up in a self-hug. Weird.`
            } else if (huggee === 'botofchess') {
                return`@${hugger} hugged me! *blush*`
            } else {
                try {
                    const response = await fetchChatters();
                    if (response.length > 0) {
                        if (find(huggee, response) !== void 0) {
                            return `@${hugger} hugs @${huggee}   :3`;
                        }
                        return `@${hugger} hugs ${huggee}.`
                    }
                } catch (e) {
                    console.log('api error:', e);
                    return `@${hugger} hugs ${huggee}.`;
                }
            }
        } catch (e) {
            console.log(e);
            return 'What are you trying to do to me?!';
        }
    }
};
