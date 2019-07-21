import Message from '../api/message';
import { Status } from './db-constants';

const minute = 1000 * 60;
const minutesUntilStale = 10;
const staleTimeout = minute * minutesUntilStale;
const isFresh = (lastUpdated: number): boolean => {
    const now = Date.now();
    return (now - lastUpdated) < staleTimeout;
};

export default (data: Data): Message => {
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
