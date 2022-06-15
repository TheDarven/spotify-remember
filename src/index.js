const express = require('express')
require('./app/utils/env-loader')
const controllerManager = require('./app/controller/controller-manager')
const { setUrl, getUrl } = require('./app/utils/url')
const { authenticate } = require('./app/database/database-manager')

// Start server
const app = express()
const hostname = process.env.HOST;
const port = process.env.PORT;

app.listen(port)

setUrl(`http://${hostname}:${port}/`);

// Init endpoints
app.use('/', controllerManager)

// Connect to database
authenticate()
    .then(async () => {
        console.log(`\x1b[32m✔ \x1b[0mServer running at ${getUrl()}`);

        const { createJob } = require('./app/tasks/history-viewer')
        createJob()

        // Init server context
        const { createContextIfNotExist } = require("./app/service/context-service");
        const { loadUsers } = require("./app/users/user-manager");

        try {
            await createContextIfNotExist();
            await loadUsers();
        } catch (err) {
            console.log(err);
        }
    })
