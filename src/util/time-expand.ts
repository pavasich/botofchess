export const second = (number: number) => number * 1000;
export const minute = (number: number) => second(number * 60);
export const hour = (number: number) => minute(number* 60);
