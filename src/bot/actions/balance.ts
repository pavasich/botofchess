import api from "../../api";
import pluralize from '../../util/pluralize';

export default (userstate: DirtyUser) => {
    const balance = api.currency.getBalanceForDirtyUser(userstate);
    const { gw2, ffxiv } = api.currency.getTicketsForDirtyUser(userstate);
    let s = '';
    const gw2Balance = gw2 > 0
        ? `${gw2} gw2 ticket${pluralize(gw2)}`
        : '';
    const ffxivBalance = ffxiv > 0
        ? `${ffxiv} ffxiv ticket${pluralize(ffxiv)}`
        : '';
    if (gw2 > 0 && ffxiv > 0) {
        s = `, ${gw2Balance}, and ${ffxivBalance}`;
    } else if (gw2 > 0) {
        s = ` and ${gw2Balance}`;
    } else if (ffxiv > 0) {
        s = ` and ${ffxivBalance}`;
    }

    return `@${userstate['display-name']}: You have ${balance} token${pluralize(balance)}${s} in the bank.`;
}
