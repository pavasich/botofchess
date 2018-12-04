import _ from 'lodash';
import db, { MODELS } from '../../db';
interface Tickets {
    [key: string]: Store
}
interface Users {
    [key: string]: User
}

const places = 5;
const raffle = (ls: Array<string>) => {
    for (let i = 0; i < places; i++) {
        const winner: string = _.shuffle(ls)[0];
        console.log(`${i + 1}: ${winner}`);
        ls = ls.filter((s) => s !== winner);
    }
};

export default () => {
    const wallets: Tickets  = db.get(MODELS.TICKETS).value();
    const users: Users = db.get(MODELS.USER).value();
    const user_ids = Object.keys(wallets);
    let ticket: Array<string> = [];
    for (let i = 0, n = user_ids.length; i < n; i++) {
        const currentUsername: any = _.constant(users[user_ids[i]].name);
        const ticketBalance: Store = wallets[user_ids[i]];
        ticket = [...ticket, ..._.times<string>(ticketBalance.ticket, currentUsername)];
    }
    console.log('WINNERS');
    raffle(ticket);
};
