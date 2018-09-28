export const set = (key: string, value: number) => {
    window.localStorage.setItem(key, `${value}`);
};

export const get = (key: string, defaultValue: number = 0): number => {
    const value = window.localStorage.getItem(key);
    if (value === null) {
        set(key, defaultValue);
        return defaultValue;
    } else {
        return parseInt(value, 10);
    }
};
