const http = require('http')
const dotenv = require('dotenv')
const { createJob } = require ('./app/tasks/history-viewer')

dotenv.config()

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
    res.statusCode = 200;
    console.log(req);
    res.setHeader('Content-Type', 'text/plain');
    res.end('Hello World');
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});

createJob()

const { initSpotifyApi, getSpotifyApi } = require('./app/spotify/spotify-manager')
initSpotifyApi();