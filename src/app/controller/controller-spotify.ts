import express, { Request, Response, Router } from "express"
import { getUrl } from "../utils/url"
import {
    buildExceptionResponse, buildIfNotFunctionException,
    FunctionalException
} from "../exception/custom-exceptions"
import { initSpotifyApi } from "../spotify/spotify-manager"
import SpotifyWebApi from "spotify-web-api-node"
import { SpotifyResponse } from "../model/SpotifyResponse"
import { getTimestamp } from "../utils/utils"
import { addUser, ManagedUser } from "../users/user-manager"
import { isAllowedUser } from "../utils/env-util"

const router: Router = express.Router()

const LOGIN_SCOPE = 'user-read-recently-played playlist-modify-public playlist-modify-private ' +
    'user-read-currently-playing playlist-read-private user-read-private user-read-email user-library-read'

router.get('/login', (req: Request, res: Response) => {
    res.redirect('https://accounts.spotify.com/authorize' +
        '?response_type=code' +
        '&client_id=' + process.env.SPOTIFY_CLIENT_ID +
        '&scope=' + encodeURIComponent(LOGIN_SCOPE) +
        '&redirect_uri=' + encodeURIComponent(`${getUrl()}spotify/callback`))
})

router.get('/callback', async (req: Request, res: Response) => {
    try {
        const code: string = req.query.code as string
        if (!code) {
            throw new FunctionalException('Aucun code n\'est présent en paramètre', 400)
        }

        const user: ManagedUser = await initUser(code)

        return res.json({ message: `Utilisateur ajouté avec succès : ${user.id}` })
    } catch (err: any) {
        return buildExceptionResponse(res, err, 'Erreur lors de l\'appel à la page')
    }
})

async function initUser(code: string): Promise<ManagedUser> {
    const spotifyApi: SpotifyWebApi = initSpotifyApi()

    let authorizationResponse: SpotifyResponse<any>
    let currentUser: SpotifyResponse<SpotifyApi.CurrentUsersProfileResponse>

    try {
        authorizationResponse = await spotifyApi.authorizationCodeGrant(code)
        spotifyApi.setAccessToken(authorizationResponse.body['access_token'])
        spotifyApi.setRefreshToken(authorizationResponse.body['refresh_token'])

        currentUser = await spotifyApi.getMe()
    } catch (err: any) {
        throw buildIfNotFunctionException(err.body.error_description, parseInt(err.statusCode), err)
    }

    if (!isAllowedUser(currentUser.body.id)) {
        throw new FunctionalException('Vous n\'êtes pas présent dans la liste des utilisateurs autorisés', 401)
    }

    return await addUser(currentUser.body.id, spotifyApi, getTimestamp() + authorizationResponse.body['expires_in'])
}

export default router
