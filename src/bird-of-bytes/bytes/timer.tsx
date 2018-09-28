import React from 'react';
import { msToHms } from '../util';

const style = {
    fontFamily: 'sans-serif',
    color: 'white',
    textShadow: 'black 2px 2px',
    fontSize: '44px',
};

export default ({ ms }: { ms: number }) => (
    <div style={style}>{msToHms(ms)}</div>
);
