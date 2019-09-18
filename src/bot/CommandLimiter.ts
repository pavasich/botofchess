import { isMod } from './util';

type SNMap = Record<string, number>;
type UserCollection = Record<string, SNMap>;


export default class CommandLimiter {
    private collection: UserCollection = {};

    public readonly timeouts: SNMap;


    public constructor(timeouts:SNMap) {
        this.timeouts = timeouts;
    }


    public enforce(dirtyUser: DirtyUser, command: string): boolean {
        if (isMod(dirtyUser)) {
            return false;
        }

        const now = Date.now();
        const name = dirtyUser['display-name'];
        if (this.collection[name] === undefined) {
            this.collection[name] = {};
        }

        const history = this.collection[name];

        if (history[command] === undefined) {
            history[command] = now;
            return false;
        }

        if (this.timeouts[command] === undefined) {
            return false;
        }

        if ((now - history[command]) > this.timeouts[command]) {
            history[command] = now;
            return false;
        }

        return true;
    }
}
