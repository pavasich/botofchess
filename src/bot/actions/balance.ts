import api from '../../api';

export default (userstate: DirtyUser) => {
    const balance = api.currency.getBalanceForDirtyUser(userstate);
    const { gw2, ffxiv } = api.currency.getTicketsForDirtyUser(userstate);

    return `@${userstate['display-name']}: [Tokens - ${balance}] :: [FFXIV - ${ffxiv}] :: [GW2 - ${gw2}]`;
}
