const { isUserExist, createUser, updateUser } = require('../database/helpers/user-helper')

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

    const userExit = await isUserExist(id);
    if (!userExit) {
        await createUser({ id, refresh_token: spotifyApi.getRefreshToken() })
    } else {
        await updateUser(id, { refresh_token: spotifyApi.getRefreshToken() })
    }

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

function loadUsers() {

}

function getUsers() {
    return users;
}

module.exports = { addUser, removeUser, loadUsers, getUsers }