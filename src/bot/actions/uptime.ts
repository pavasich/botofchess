export default (start_time: number|void) => {
    if (start_time === undefined) {
        return 'Stream is offline, try again later >D';
    }
    const now: number = Date.now();
    let running = (now - start_time);
    running = Math.floor(running / 1000);
    const hours = Math.floor(running / (60 * 60));
    running %= (60 * 60);
    const minutes = Math.floor(running / (60));
    const seconds = running % 60;

    const t = [];

    if (hours > 0) {
        if (hours > 1) {
            t.push(`${hours} hours`);
        } else {
            t.push('1 hour');
        }
    }

    if (minutes > 0) {
        if (minutes > 1) {
            t.push(`${minutes} minutes`);
        } else {
            t.push('1 minute');
        }
    }

    if (seconds > 0) {
        if (seconds > 1) {
            t.push(`${seconds} seconds`);
        } else {
            t.push('1 second');
        }
    }

    let s;
    if (t.length === 1) {
        s = t[0];
    } else if (t.length === 2) {
        s = `${t[0]} and ${t[1]}`;
    } else {
        s = `${t[0]}, ${t[1]}, and ${t[2]}`;
    }


    return `birdofchess has been streaming for ${s}.`;
};
