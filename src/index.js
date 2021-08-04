const express = require('express')
const dotenv = require('dotenv')
const endpoint = require('./app/endpoint/endpoint-manager')
const { setUrl, getUrl } = require('./app/main-manager')
const { createJob } = require('./app/tasks/history-viewer')
dotenv.config()
const { authenticate } = require('./app/database/database-manager')

const app = express()
const hostname = '127.0.0.1';
const port = 3000;
app.listen(port)

setUrl(`http://${hostname}:${port}/`);

app.get('', (req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Hello World');
});

app.use('/', endpoint)

createJob()

authenticate()

console.log(`Server running at ${getUrl()}`);
