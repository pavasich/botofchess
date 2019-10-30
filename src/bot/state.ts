import CommandLimiter from './CommandLimiter';
import limits from './limits';

export enum Prop {
    enableEvent = 'enableEvent',
    rateLimit = 'rateLimit',
    broadcasting = 'broadcasting',
    enableLogging = 'enableLogging',
    eventInterval = 'eventInterval',
    startTime = 'startTime',
    subsonly = 'subsonly',
    tricking = 'tricking',
}

export interface AppState {
    [Prop.broadcasting]: boolean;
    [Prop.enableEvent]: boolean;
    [Prop.enableLogging]: boolean;
    [Prop.eventInterval]: NodeJS.Timer|null;
    [Prop.rateLimit]: CommandLimiter;
    [Prop.startTime]: number|void;
    [Prop.subsonly]: boolean;
    [Prop.tricking]: boolean;
}


function getDefaultState(): AppState {
    return {
        [Prop.broadcasting]: false,
        [Prop.enableEvent]: false,
        [Prop.enableLogging]: false,
        [Prop.eventInterval]: null,
        [Prop.rateLimit]: new CommandLimiter(limits),
        [Prop.startTime]: undefined,
        [Prop.subsonly]: false,
        [Prop.tricking]: false,
    };
}

let state = getDefaultState();

export function getState() {
    return state;
}

export function setState(newState: Partial<AppState>) {
   Object.assign(state, newState);
}
