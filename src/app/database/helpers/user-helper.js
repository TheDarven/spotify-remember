const { FunctionalException } = require('../../exception/custom-exceptions')
const { User } = require('../models/index')

const ERROR_GET_USER = 'Erreur lors de la récupération de l\'utilisateur.';
const ERROR_CREATE_USER = 'Erreur lors de la création de l\'utilisateur.';
const ERROR_UPDATE_USER = 'Erreur lors de la modification de l\'utilisateur.';

async function getUserById(id) {
    try {
        return await User.findOne({ where: { id } });
    } catch (e) {
        throw new FunctionalException(`${ERROR_GET_USER} Id: ${id}`, 500)
    }
}

async function isUserExist(id) {
    return await getUserById(id) !== null;
}

async function createUser(attributes) {
    try {
        return await User.create({ ...attributes });
    } catch (e) {
        throw new FunctionalException(`${ERROR_CREATE_USER} Id: ${id}`, 500)
    }
}

async function updateUser(id, values) {
    try {
        return await User.update({ ...values }, { where: { id }});
    } catch (e) {
        throw new FunctionalException(`${ERROR_UPDATE_USER} Id: ${id}`, 500)
    }
}

module.exports = { getUserById, isUserExist, createUser, updateUser }