type CommandCollection = {
    [key: string]: number
}
type UserCollection = {
    [key: string]: CommandCollection
}

export default class CommandLimiter {
    collection: UserCollection = {};
    timeouts: CommandCollection;
    constructor(timeouts: CommandCollection) {
        this.timeouts = timeouts;
    }
    enforce = (dirtyUser: DirtyUser, command: string): boolean => {
        const now = Date.now();
        const name = dirtyUser['display-name'];
        if (this.collection[name] === undefined) {
            this.collection[name] = {};
        }
        const history: CommandCollection = this.collection[name];
        if (history[command] === undefined) {
            history[command] = now;
            return false;
        }
        if ((now - history[command]) > this.timeouts[command]) {
            history[command] = now;
            return false;
        }
        return true;
    }
}