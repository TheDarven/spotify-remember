const express = require('express')
const router = express.Router()
const { getUrl } = require('../../main-manager')
const { initSpotifyApi } = require('../../spotify/spotify-manager')
const { FunctionalException, buildExceptionResponse, buildIfNotFunctionException } = require('../../exception/custom-exceptions')
const { addUser } = require('../../users/user-manager')
const { getTimestamp } = require('../../utils/utils')

router.get('/login', (req, res) => {
    // TODO Mettre state

    const scopes = 'user-read-recently-played playlist-modify-public playlist-modify-private ' +
        'user-read-currently-playing playlist-read-private user-read-private user-read-email user-library-read';
    res.redirect('https://accounts.spotify.com/authorize' +
        '?response_type=code' +
        '&client_id=' + process.env.SPOTIFY_CLIENT_ID +
        (scopes ? '&scope=' + encodeURIComponent(scopes) : '') +
        '&redirect_uri=' + encodeURIComponent(`${getUrl()}spotify/callback`));
});

router.get('/callback', async (req, res) => {
    try {
        const { code, state } = req.query
        if (!code) {
            throw new FunctionalException('Aucun code n\'est présent en paramètre', 500)
        }

        const user = await initUser(code)

        return res.json({ message: `Utilisateur ajouté avec succès : ${user.id}` })
    } catch (err) {
        return buildExceptionResponse(res, err, 'Erreur lors de l\'appel à la page')
    }
});

async function initUser(code) {
    const spotifyApi = initSpotifyApi();

    let authorizationResponse;
    let currentUser;

    try {
        authorizationResponse = await spotifyApi.authorizationCodeGrant(code);
        spotifyApi.setAccessToken(authorizationResponse.body['access_token']);
        spotifyApi.setRefreshToken(authorizationResponse.body['refresh_token']);

        currentUser = await spotifyApi.getMe();
    } catch (err) {
        throw buildIfNotFunctionException(err.body.error_description, parseInt(err.statusCode), err)
    }

    return await addUser(currentUser.body.id, spotifyApi, getTimestamp() + authorizationResponse.body['expires_in']);
}

module.exports = router