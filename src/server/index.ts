import express from 'express';
import path from 'path';

const index = path.resolve(__dirname, './index.html');

const server = express();

server.get('*', (req, res) => {
    res.sendFile(index);
});

const port = process.env.NODE_ENV === 'production'
    ? 80
    : 8008;

server.listen(port, () => {
    console.log(`running on port ${port}!`);
});

export default server;
