declare module 'twitch-js';
declare module 'whatwg-fetch';
declare module '*.json' {
    const value: any;
    export default value;
}

interface Line {
    message: string
    delay?: number
}

interface User {
    id: string
    name: string
    subscriber: boolean
    moderator: boolean
    isFollower?: string
    lastUpdated?: number
}

interface DirtyUser {
    badges: object
    color: string
    'display-name': string
    emotes: any
    id: string
    mod: boolean
    'room-id': string
    subscriber: boolean
    'tmi-sent-ts': string
    turbo: boolean
    'user-id': string
    'user-type': string
    'emotes-raw': any
    'badges-raw': string
    username: string
    'message-type': any
}


interface Data {
    lastUpdated?: number
}

type Message = {
    code: number
    message?: string
    status?: string
}
