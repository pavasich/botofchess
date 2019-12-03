import { minute } from '../../util/time-expand';
import pluralize from '../../util/pluralize';

let __interval: NodeJS.Timer;


export function setReminder(rawMessage: string, callback: (s: string) => void) {
    const sanitized = rawMessage.replace('!set-reminder ', '');
    const i = sanitized.indexOf(sanitized[0], 1);
    if (i === -1) {
        return 'Reminder message was not formatted correctly.';
    }

    const reminderMessage = sanitized.slice(1, i);
    const temp = sanitized
        .slice(i + 1)
        .replace(/[\s]/g, '');

    let reminderInterval = parseInt(temp, 10);
    if (reminderInterval !== reminderInterval) {
        reminderInterval = 15;
    } else if (reminderInterval < 1) {
        reminderInterval = 1;
    } else if (reminderInterval > 120) {
        reminderInterval = 120;
    }

    const timeAsMs = minute(reminderInterval);

    clearInterval(__interval);
    __interval = setInterval(() => {
        callback(reminderMessage);
    }, timeAsMs);

    return `Message will repeat every ${reminderInterval === 1 ? '' : `${reminderInterval} `}minute${pluralize(reminderInterval)}!`;
}


export function clearReminder() {
    clearInterval(__interval);
}
