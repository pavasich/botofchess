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

interface Store {
    ffxiv: number
    gw2: number
    ticket: number
}

interface Data {
    lastUpdated?: number
}

type Message = {
    code: number
    message?: string
    status?: string
}


interface TwitchSubscribersSubscriberUser {
    _id: string
    bio: string
    created_at: string
    display_name: string
    logo: string
    name: string
    type: string
    updated_at: string
}

interface TwitchSubscribersSubscriber {
    _id: string
    created_at: string
    sub_plan: string
    sub_plan_name: string
    user: TwitchSubscribersSubscriberUser
}

interface TwitchSubscribersResponse {
    _total: number,
    subscribers: Array<TwitchSubscribersSubscriber>
}
