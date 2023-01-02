import express, { Express } from 'express'
import { getUrl, setUrl } from './app/utils/url'
import controllerManager from "./app/controller/controller-manager"
import { createJob } from "./app/tasks/history-viewer"
import { createContextIfNotExist } from "./app/service/context-service"
import { loadUsers } from "./app/users/user-manager"
import { authenticate } from "./app/database/database-manager"

// Start server
const app: Express = express()
const hostname: string = process.env.HOST ?? ''
const port: number = Number(process.env.PORT) ?? 3000

app.listen(port)

setUrl(`http://${hostname}:${port}/`)

// Connect to database
authenticate()
    .then(async () => {
        console.log(`\x1b[32m✔ \x1b[0mServer running at ${getUrl()}`)

        createJob()

        // Init endpoints
        app.use('/', controllerManager)

        // Init server context
        try {
            await createContextIfNotExist()
            await loadUsers()
        } catch (err: any) {
            console.log(err)
        }
    })
