export const second = (seconds: number) => seconds * 1000;
export const minute = (minutes: number) => second(minutes * 60);
export const hour = (hours: number) => minute(hours * 60);

export default {
    second,
    minute,
    hour,
};
