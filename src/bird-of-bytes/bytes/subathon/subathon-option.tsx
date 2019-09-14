import React, { FC } from 'react';
import Draggable from 'react-draggable';

const handleSrc = require('../svg/handle.svg');
import { style } from './style';


/** types */
interface Props {
    count: number;
    option: string;
}


/** util */
const handle = <img draggable={false} src={handleSrc} />;


/** component */
export const SubathonOption: FC<Props> = function Option({ option, count }) {
    return (
        <Draggable handle=".handle" key={option} grid={[25, 25]}>
            <div className="draggy sm">
                <div className="dock">
                    <div className="element handle">{handle}</div>
                    <div style={style.dock}>{option}</div>
                </div>
                <button style={style.button}>
                    <div style={style.count}>
                        <div className="count-controlled-color">{count}</div>
                    </div>
                </button>
            </div>
        </Draggable>
    )
};
