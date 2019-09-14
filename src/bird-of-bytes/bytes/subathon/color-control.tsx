import React, { useMemo, useCallback } from 'react';
import Draggable from 'react-draggable';
const handleSrc = require('../svg/handle.svg');

const handle = <img draggable={false} src={handleSrc} />;


export function ColorControl() {
    const style = useMemo(() => {
        const el = document.createElement('style');
        document.body.appendChild(el);
        el.innerHTML = `
        .count-controlled-color {
            color: #fff;
        }
        `;
        return el;
    }, []);

    const handleChange = useCallback((e) => {
        style.innerHTML = `
        .count-controlled-color {
            color: ${e.target.value};
        }
        `;
    }, []);

    return (
        <Draggable handle=".handle">
            <div>
                <div className="element handle">{handle}</div>
                <input onChange={handleChange} />
            </div>
        </Draggable>
    )
}
