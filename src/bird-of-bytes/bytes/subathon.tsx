import React, {CSSProperties} from 'react';
import Draggable from 'react-draggable';
import client from '../client';
import {hour, minute, second} from '../../util/time-expand';
import Timer from './timer';
import { isMod } from '../util';
import * as storage from '../storage';
const playSrc = require('./svg/play.svg');
const pauseSrc = require('./svg/pause.svg');
const handleSrc = require('./svg/handle.svg');

const handle = <img draggable={false} src={handleSrc} />;
const play = <img draggable={false} src={playSrc} />;
const pause = <img draggable={false} src={pauseSrc} />;

const containerStyle: CSSProperties = {
    position: 'fixed',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    width: '100vw',
    height: '100vh',
    background: 'limegreen',
};

let interval;

type Colors = {
    [key: string]: number
    cherry: number
    purple: number
    silver: number
    blonde: number
    teal: number
    foxy: number
};

interface State {
    colors: Colors
    timeUntilDeath: number
}

const getTime = () => {
    let t = window.localStorage.getItem('timeUntilDeath');
    if (t === null) {
        const time = hour(4);
        window.localStorage.setItem('timeUntilDeath', `${time}`);
        return time;
    }
    return parseInt(t, 10);
};

const numberMap = {
    1: 5,
    2: 10,
    3: 25,
};

const timeMap = {
    1: 7.5,
    2: 15,
    3: 37.5,
};

export default class Subathon extends React.Component<{}, State> {
    constructor(props) {
        super(props);
        this.state = {
            colors: {
                cherry: storage.get('cherry'),
                purple: storage.get('purple'),
                silver: storage.get('silver'),
                blonde: storage.get('blonde'),
                teal: storage.get('teal'),
                foxy: storage.get('foxy'),
            } as Colors,
            timeUntilDeath: getTime(),
        };

        this.countdown = this.countdown.bind(this);
        this.toggleTimer = this.toggleTimer.bind(this);
        this.pause = this.pause.bind(this);
        this.resume = this.resume.bind(this);
        this.modifyColor = this.modifyColor.bind(this);
    }

    componentDidMount() {
        client.on('chat', (channel: string, userstate: DirtyUser, message: string, self: boolean) => {
            if (self || userstate.username === 'botofchess' || !isMod(userstate)) return;

            if (message[0] === '!') {
                const tokens = message.split(' ');
                if (tokens[0] === '!subathon') {
                    const color: string = tokens[1].toLowerCase();
                    if (color === 'cherry' || color === 'purple' || color === 'silver' || color === 'teal' || color === 'blonde' || color === 'foxy') {
                        if (tokens[2] === 'donation') {
                            const n = parseInt(tokens[3], 10);
                            if (n === n) {
                                storage.set(color, this.state.colors[color] + n);
                            } else {
                                client.action(channel, 'That is not a number, my dude');
                            }
                        } else {
                            const n = parseInt(tokens[2], 10);
                            if (n !== n) {
                                client.action(channel, 'That is not a number, my dude.');
                            } else {
                                if (n === 1 || n === 2 || n === 3) {
                                    const newCount = this.state.colors[color] + numberMap[n];
                                    storage.set(color, newCount);
                                    this.setState({
                                        colors: {
                                            ...this.state.colors,
                                            [color]: newCount,
                                        },
                                    });
                                }
                            }
                        }
                    } // end region colors

                    if (color === 'time') {
                        if (tokens[2] === 'donation') {
                            const n = parseInt(tokens[3], 10);
                            if (n === n) {
                                const newTime = this.state.timeUntilDeath + minute(n);
                                storage.set('timeUntilDeath', newTime);
                                this.setState({ timeUntilDeath: newTime });
                            }
                        } else {
                            const time = parseInt(tokens[2], 10);
                            if (time !== time || time < 1 || time > 3) {
                                client.action(channel, `${tokens[2]} is not a valid number, my dude.`);
                            } else {
                                const newTime = this.state.timeUntilDeath + minute(timeMap[time]);
                                storage.set('timeUntilDeath', newTime);
                                this.setState({
                                    timeUntilDeath: newTime,
                                });
                            }
                        }
                    }

                    if (color === 'set') {
                        const prop = tokens[2];
                        const newValue = parseInt(tokens[3], 10);
                        if (newValue === newValue) {
                            if (prop === 'cherry' || prop === 'purple' || prop === 'silver' || prop === 'teal' || prop === 'blonde' || prop === 'foxy') {
                                storage.set(prop, newValue);
                                this.setState({
                                    colors: {
                                        ...this.state.colors,
                                        [color]: newValue,
                                    },
                                });
                            } else if (prop === 'time') {
                                storage.set('timeUntilDeath', newValue);
                                this.setState({ timeUntilDeath: newValue });
                            }
                            this.forceUpdate();
                        }
                    }
                    // end region !subathon
                }
            }
        });

        client.on('resub', () => {
            storage.set('timeUntilDeath', this.state.timeUntilDeath + minute(10));
            this.setState({
                timeUntilDeath: this.state.timeUntilDeath + minute(10),
            })
        });

        client.on('subgift', () => {
            storage.set('timeUntilDeath', this.state.timeUntilDeath + minute(10));
            this.setState({
                timeUntilDeath: this.state.timeUntilDeath + minute(10),
            });
        });

        client.on('subscription', () => {
            storage.set('timeUntilDeath', this.state.timeUntilDeath + minute(10));
            this.setState({
                timeUntilDeath: this.state.timeUntilDeath + minute(10),
            });
        });

        client.connect();
        clearInterval(interval);
        if (storage.get('pauseStatus', 1) === 0) {
            interval = setInterval(this.countdown, second(1));
        }
    }

    componentWillUnmount() {
        client.disconnect();
    }

    countdown() {
        storage.set('timeUntilDeath', this.state.timeUntilDeath - second(1));
        this.setState({
            timeUntilDeath: this.state.timeUntilDeath - second(1),
        });
    };

    toggleTimer() {
        if (storage.get('pauseStatus', 1) === 1) {
            storage.set('pauseStatus', 0);
            this.resume();
        } else {
            storage.set('pauseStatus', 1);
            this.pause();
        }
        this.forceUpdate();
    };

    pause() {
        clearInterval(interval as NodeJS.Timer);
        interval = undefined;
    };

    resume() {
        interval = setInterval(this.countdown, second(1));
    };

    modifyColor(color: string, count: number) {
        storage.set(color, this.state.colors[color] + count);
        this.setState({
            colors: {
                ...this.state.colors,
                [color]: this.state.colors[color] + count,
            }
        })
    };

    renderCircle(color: string, count: number) {
        return (
            <Draggable handle=".handle" key={color} grid={[25, 25]}>
                <div className="draggy sm">
                    <div className="dock">
                        <div className="element handle">{handle}</div>
                        <div style={{ transform: 'rotate(90deg) translateX(-56px )', color: '#000', fontFamily: 'sans-serif' }}>{color}</div>
                    </div>
                    <button
                        style={{
                            borderRadius: '50%',
                            fontFamily: 'sans-serif',
                            fontSize: '40px',
                            color: '#000',
                            width: '100px',
                            height: '100px',
                            outline: 0,
                        }}
                        onClick={() => {
                            this.modifyColor(color, 1);
                        }}
                    >
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                        }}>
                            <div>{count}</div>
                        </div>
                    </button>
                </div>
            </Draggable>
        );
    }

    render() {
        const { colors, timeUntilDeath } = this.state;
        const toggleIcon = storage.get('pauseStatus') === 1
            ? play
            : pause;

        return (
            <div style={containerStyle}>
                <div style={{ display: 'flex' }}>
                    {Object.keys(colors).map((color) => this.renderCircle(color, this.state.colors[color]))}
                </div>
                <Draggable
                    handle=".handle"
                    grid={[25, 25]}
                >
                    <div className="draggy">
                        <Timer ms={timeUntilDeath} />
                        <div className="dock">
                            <div className="element handle">{handle}</div>
                            <button
                                title="Click To Pause/Resume"
                                className="element toggler"
                                onClick={this.toggleTimer}
                            >
                                {toggleIcon}
                            </button>
                        </div>
                    </div>
                </Draggable>
            </div>
        );
    }
}
