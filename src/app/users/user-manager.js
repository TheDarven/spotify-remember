let users = []

function createUser(id, spotifyApi, expiresToken) {
    removeUser(id)
    const user = {
        id, spotifyApi, expiresToken
    }
    users.push(user)
    return user
}

function removeUser(id) {
    users = users.filter(user => user.id !== id)
}

function loadUsers() {

}

function getUsers() {
    return users;
}

module.exports = { createUser, removeUser, loadUsers, getUsers }