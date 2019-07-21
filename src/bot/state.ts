import CommandLimiter from './CommandLimiter';
import limits from './limits';

export enum Prop {
    enableEvent = 'enableEvent',
    rateLimit = 'rateLimit',
    broadcasting = 'broadcasting',
    chatterInterval = 'chatterInterval',
    chatters = 'chatters',
    enableLogging = 'enableLogging',
    eventInterval = 'eventInterval',
    startTime = 'startTime',
    subsonly = 'subsonly',
    tricking = 'tricking',
    usernameSet = 'usernameSet',

}

export interface AppState {
    [Prop.broadcasting]: boolean;
    [Prop.chatterInterval]: NodeJS.Timer|null;
    [Prop.chatters]: Array<string>;
    [Prop.enableEvent]: boolean;
    [Prop.enableLogging]: boolean;
    [Prop.eventInterval]: NodeJS.Timer|null;
    [Prop.rateLimit]: CommandLimiter;
    [Prop.startTime]: number|void;
    [Prop.subsonly]: boolean;
    [Prop.tricking]: boolean;
    [Prop.usernameSet]: Set<string>|void;
}


function getDefaultState(): AppState {
    return {
        [Prop.broadcasting]: false,
        [Prop.chatterInterval]: null,
        [Prop.chatters]: [],
        [Prop.enableEvent]: true,
        [Prop.enableLogging]: false,
        [Prop.eventInterval]: null,
        [Prop.rateLimit]: new CommandLimiter(limits),
        [Prop.startTime]: undefined,
        [Prop.subsonly]: false,
        [Prop.tricking]: false,
        [Prop.usernameSet]: undefined
    };
}

export const state = getDefaultState();

export function setState(newState: Partial<AppState>) {
   Object.assign(state, newState);
}
