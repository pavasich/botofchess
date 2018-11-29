import api from "../../api";
import pluralize from '../../util/pluralize';

export default (userstate: DirtyUser) => {
    const balance = api.currency.getBalanceForDirtyUser(userstate);
    const { ticket } = api.currency.getTicketsForDirtyUser(userstate);
    const s = ticket > 0
        ? ` and ${ticket} ticket${pluralize(ticket)}`
        : '';

    return `@${userstate['display-name']}: You have ${balance} token${pluralize(balance)}${s} in the bank.`;
}
