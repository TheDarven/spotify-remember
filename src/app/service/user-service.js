const { FunctionalException } = require('../exception/custom-exceptions')
const { User } = require('../model')

const ERROR_GET_USER = 'Erreur lors de la récupération de l\'utilisateur.';
const ERROR_GET_USERS = 'Erreur lors de la récupération de tout les utilisateurs.';
const ERROR_CREATE_USER = 'Erreur lors de la création de l\'utilisateur.';
const ERROR_UPDATE_USER = 'Erreur lors de la modification de l\'utilisateur.';

async function getUserById(id) {
    try {
        return await User.findOne({ where: { id } });
    } catch (e) {
        throw new FunctionalException(`${ERROR_GET_USER} Id: ${id}`, 500)
    }
}

async function getAllUsers() {
    try {
        return await User.findAll();
    } catch (e) {
        throw new FunctionalException(`${ERROR_GET_USERS}`, 500)
    }
}

async function isUserExisting(id) {
    return await getUserById(id) !== null;
}

async function createUser(attributes) {
    try {
        return await User.create({ ...attributes });
    } catch (e) {
        throw new FunctionalException(`${ERROR_CREATE_USER}`, 500)
    }
}

async function createUserIfNotExist(id, attributes) {
    if (await isUserExisting(id)) {
        return await getUserById(id);
    }
    return await createUser({ id, ...attributes });
}

async function updateUser(id, attributes) {
    try {
        return await User.update({ ...attributes }, { where: { id }});
    } catch (e) {
        console.log(e);
        throw new FunctionalException(`${ERROR_UPDATE_USER} Id: ${id}`, 500)
    }
}

async function createOrUpdateUser(id, attributes) {
    if (await isUserExisting(id)) {
        return await updateUser(id, attributes);
    }
    return await createUser({ id, ...attributes });
}

module.exports = { getUserById, getAllUsers, isUserExisting, createUser, createUserIfNotExist, updateUser, createOrUpdateUser }
