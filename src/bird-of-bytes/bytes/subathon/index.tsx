import React, { useState, useEffect } from 'react';
import { SubathonOption } from './subathon-option';
import client from '../../client';
import { isMod } from '../../util';
import * as storage from '../../storage';
import { style } from './style';
import { logicEngine, toN } from './util';
import { ColorControl } from './color-control';

/** util */
enum Option {
    ffxiv = 'ffxiv',
    gw2 = 'gw2',
}


/** component */
export default function Subathon() {
    const [counts, updateCounts] = useState({
        [Option.ffxiv]: storage.get(Option.ffxiv),
        [Option.gw2]: storage.get(Option.gw2),
    });


    function deriveNewState() {
        updateCounts({
            [Option.ffxiv]: storage.get(Option.ffxiv),
            [Option.gw2]: storage.get(Option.gw2),
        });
    }


    function update(option: Option, count: number) {
        storage.set(option, count);
        deriveNewState();
    }


    useEffect(() => {
        client.on('chat', (channel: string, userstate: DirtyUser, rawMessage: string, self: boolean) => {
            if (self || userstate.username === 'botofchess' || !isMod(userstate)) return;
            const message = rawMessage.toLowerCase();
            if (message[0] === '!') {
                const [cmd, option, s0, s1] = message.split(' ');
                if (cmd === '!subtember') {
                    if (option === Option.ffxiv || option === Option.gw2) {
                        const match = /[“”"](.*)[“”"]/.exec(message);
                        if (match === null) {
                            return undefined;
                        }

                        const value = logicEngine(match[1]);
                        if (value !== undefined) {
                            update(option, value + storage.get(option));
                        }
                    }

                    if (option === 'set' && (
                        s0 === Option.ffxiv || s0 === Option.gw2
                    )) {
                        const newValue = toN(s1);
                        if (newValue === newValue) {
                                update(s0, newValue);
                        }
                    }
                }
            }
        });

        client.connect();

        return () => {
            client.disconnect();
        };
    }, []);


    return (
        <div style={style.container}>
            <div style={style.row}>
                <SubathonOption option={Option.ffxiv} count={counts[Option.ffxiv]} />
                <SubathonOption option={Option.gw2} count={counts[Option.gw2]} />
            </div>
            <ColorControl />
        </div>
    );
}
