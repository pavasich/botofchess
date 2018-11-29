import api from "../../api";

const assertKeyOfStore = (string: string): keyof Store | void => {
    if (string === 'ticket') return string;
    return undefined;
};

export default (userstate: DirtyUser, quantity: string, purchaseRequest: string) => {
    const item = assertKeyOfStore(purchaseRequest);
    if (item !== undefined) {
        const result = api.currency.purchase(userstate, parseInt(quantity, 10), item);
        return `@${userstate['display-name']}: ${result}`;
    }
    return undefined;
};
