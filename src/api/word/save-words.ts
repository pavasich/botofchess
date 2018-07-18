interface Word {
    count: number
    users: {
        [key: string]: number
    }
}

import db, { MODELS } from '../../db';

const sanitizer = /([^\w\d\s!'\-]+)/gi;

export default ({ username }: DirtyUser, message: string) => {
    const tokens = message
        .replace(sanitizer, '')
        .split(' ')
    for (let i = 0, n = tokens.length; i < n; i++) {
        let current: Word = db.get(MODELS.WORD).get(tokens[i]).value();
        if (current === undefined) {
            current = {
                count: 0,
                users: {
                    [username]: 0,
                },
            };
        }
        db
            .get(MODELS.WORD)
            .set(tokens[i] + '.count', current.count + 1)
            .set(tokens[i] + '.users.' + username, current.users[username] + 1)
            .write();
    }
};
