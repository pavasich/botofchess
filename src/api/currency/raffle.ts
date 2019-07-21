import _ from 'lodash';
import db from '../../db';
import { Model } from '../../db/db-constants';

type Tickets = Record<string, Store>;
type Users = Record<string, User>;

const places = 5;
const raffle = (ls: string[]) => {
    for (let i = 0; i < places; i++) {
        const winner: string = _.shuffle(ls)[0];
        console.log(`${i + 1}: ${winner}`);
        ls = ls.filter((s) => s !== winner);
    }
};

export default () => {
    const wallets: Tickets  = db.get(Model.Tickets).value();
    const users: Users = db.get(Model.User).value();
    const user_ids = Object.keys(wallets);
    let ffxiv: string[] = [];
    let gw2: string[] = [];
    for (let i = 0, n = user_ids.length; i < n; i++) {
        const currentUsername: any = _.constant(users[user_ids[i]].name);
        const ticketBalance: Store = wallets[user_ids[i]];
        ffxiv = [...ffxiv, ..._.times<string>(ticketBalance.ffxiv, currentUsername)];
        gw2 = [...gw2, ..._.times<string>(ticketBalance.gw2, currentUsername)];
    }
    console.log('FFXIV WINNERS');
    raffle(ffxiv);
    console.log('GW2 WINNERS');
    raffle(gw2);
};
