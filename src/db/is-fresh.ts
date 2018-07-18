import Message from '../api/message';
import Data from '../models/Data';
import { STATUSES } from './db-constants';

const minute = 1000 * 60;
const minutesUntilStale = 30;
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
                ? STATUSES.FRESH
                : STATUSES.STALE,
        };
    }
    return {
        code: 404,
        message: 'Not Found',
    };
}
