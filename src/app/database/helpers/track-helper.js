const { FunctionalException } = require('../../exception/custom-exceptions')
const { Track } = require('../models/index')

const ERROR_GET_TRACK = 'Erreur lors de la récupération de la musique.';
const ERROR_CREATE_TRACK = 'Erreur lors de la création de la musique.';

async function getTrackById(id) {
    try {
        return await Track.findOne({ where: { id } });
    } catch (e) {
        throw new FunctionalException(`${ERROR_GET_TRACK} Id: ${id}`, 500)
    }
}

async function isTrackExisting(id) {
    return await getTrackById(id) !== null;
}

async function createTrack(attributes) {
    try {
        return await Track.create({ ...attributes });
    } catch (e) {
        throw new FunctionalException(`${ERROR_CREATE_TRACK}`, 500)
    }
}

async function createTrackIfNotExist(id, attributes) {
    if (await isTrackExisting(id)) {
        return await getTrackById(id);
    }
    return await createTrack({ id, ...attributes });
}

module.exports = { getTrackById, isTrackExisting, createTrack, createTrackIfNotExist }