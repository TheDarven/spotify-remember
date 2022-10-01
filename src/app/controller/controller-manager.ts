import express, { Request, Response, Router } from "express"
import spotifyController from './controller-spotify'

const router: Router = express.Router()

router.get('', (req: Request, res: Response) => {
    res.statusCode = 200
    res.setHeader('Content-Type', 'text/plain')
    res.end('Hello World')
})

router.use('/spotify', spotifyController)

export default router
