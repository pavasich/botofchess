import { CSSProperties } from 'react';

export const style: Record<string, CSSProperties> =  {
    container: {
        position: 'fixed',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        width: '100vw',
        height: '100vh',
        background: 'limegreen',
    },
    row: {
        display: 'flex',
    },
    dock: {
        transform: 'rotate(90deg) translateX(-56px )',
        color: '#000',
        fontFamily: 'sans-serif',
    },
    button: {
        borderRadius: '50%',
        fontFamily: 'sans-serif',
        fontSize: '40px',
        color: '#000',
        width: '100px',
        height: '100px',
        outline: 0,
    },
    count: {
        display: 'flex',
        flexDirection: 'column',
    },
};
