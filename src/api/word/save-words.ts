import db from '../../db';
import { Model } from '../../db/db-constants';

interface Word {
    count: number
    users: {
        [key: string]: number
    }
}

const sanitizer = /([^\w\d\s!'\-]+)/gi;

export default ({ username }: DirtyUser, message: string) => {
    const tokens = message
        .replace(sanitizer, '')
        .split(' ');
    for (let i = 0, n = tokens.length; i < n; i++) {
        let current: Word = db.get(Model.Word).get(tokens[i]).value();
        if (current === undefined) {
            current = {
                count: 0,
                users: {
                    [username]: 0,
                },
            };
        }
        db
            .get(Model.Word)
            .set(tokens[i], {
                count: current.count + 1,
                users: {
                    ...current.users,
                    [username]: current.users[username] + 1,
                },
            })
            .write();
    }
};
