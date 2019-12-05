import Message from '../api/message';
import { Status } from './db-constants';
import { minute } from '../util/time-expand';

const TIME_UNTIL_STALE = minute(10);


function isFresh(lastUpdated: number): boolean {
    const now = Date.now();
    return (now - lastUpdated) < TIME_UNTIL_STALE;
}

export default function (data: Data): Message {
    if (data.lastUpdated !== undefined) {
        return {
            code: 200,
            status: isFresh(data.lastUpdated)
                ? Status.Fresh
                : Status.Stale,
        };
    }
    return {
        code: 404,
        message: 'Not Found',
    };
}
