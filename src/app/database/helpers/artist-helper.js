const { FunctionalException } = require('../../exception/custom-exceptions')
const { Artist } = require('../models/index')

const ERROR_GET_ARTIST = 'Erreur lors de la récupération de l\'artiste.';
const ERROR_CREATE_ARTIST = 'Erreur lors de la création de l\'artiste.';

async function getArtistById(id) {
    try {
        return await Artist.findOne({ where: { id } });
    } catch (e) {
        throw new FunctionalException(`${ERROR_GET_ARTIST} Id: ${id}`, 500)
    }
}

async function isArtistExisting(id) {
    return await getArtistById(id) !== null;
}

async function createArtist(attributes) {
    try {
        return await Artist.create({ ...attributes });
    } catch (e) {
        throw new FunctionalException(`${ERROR_CREATE_ARTIST}`, 500)
    }
}

async function createArtistIfNotExist(id, attributes) {
    if (await isArtistExisting(id)) {
        return await getArtistById(id);
    }
    return await createArtist({ id, ...attributes });
}

module.exports = { getArtistById, isArtistExisting, createArtist, createArtistIfNotExist }