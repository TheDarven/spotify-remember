const { createOrUpdateUser } = require('../database/helpers/user-helper')
const { getAllUsers } = require('../database/helpers/user-helper');
const { initSpotifyApi } = require('../spotify/spotify-manager');
const { getTimestamp } = require('../utils/utils');

// Les utilisateurs du context
let users = []

/**
 * Permet d'ajouter un <b>utilisateur</b> au context.
 *
 * @param id
 * @param spotifyApi
 * @param expiresToken
 * @returns {Promise<{spotifyApi, id, expiresToken}>}
 */
async function addUser(id, spotifyApi, whenTokenExpires) {
    removeUser(id)

    await createOrUpdateUser(id, { refresh_token: spotifyApi.getRefreshToken() })

    const user = {
        id, spotifyApi, whenTokenExpires
    }
    users.push(user)
    return user
}

/**
 * Permet de retirer un <b>utilisateur</b> au context.
 *
 * @param id
 */
function removeUser(id) {
    users = users.filter(user => user.id !== id)
}

async function loadUsers() {
    const users = await getAllUsers();
    for (const user of users) {
        const spotifyApi = initSpotifyApi();
        spotifyApi.setRefreshToken(user.refresh_token);

        const refreshAccessToken = await spotifyApi.refreshAccessToken();
        spotifyApi.setAccessToken(refreshAccessToken.body['access_token']);
        await addUser(user.id, spotifyApi, getTimestamp() + refreshAccessToken.body['expires_in']);
    }
}

async function refreshTokenOfUser(user) {
    const { spotifyApi } = user;
    const refreshAccessToken = await spotifyApi.refreshAccessToken();
    spotifyApi.setAccessToken(refreshAccessToken.body['access_token']);
    user.whenTokenExpires = getTimestamp() + refreshAccessToken.body['expires_in'];
}

function getUsers() {
    return users;
}

module.exports = { addUser, removeUser, loadUsers, refreshTokenOfUser, getUsers }