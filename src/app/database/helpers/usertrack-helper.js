const { FunctionalException } = require('../../exception/custom-exceptions')
const { UserTrack } = require('../models/index')

const ERROR_GET_USER_TRACK = 'Erreur lors de la récupération d\'une musique d\'un utilisateur.';
const ERROR_CREATE_USER_TRACK = 'Erreur lors de la création de la musique d\'un utilisateur.';
const ERROR_UPDATE_USER_TRACK = 'Erreur lors de la modification de la musique d\'un l\'utilisateur.';

async function getUserTrackByIds(userId, trackId) {
    try {
        return await UserTrack.findOne({ where: { id_user: userId, id_track: trackId } });
    } catch (e) {
        console.log(e);
        throw new FunctionalException(`${ERROR_GET_USER_TRACK} User id: ${userId} | Track id : ${trackId}`, 500)
    }
}

async function isUserTrackExisting(userId, trackId) {
    return await getUserTrackByIds(userId, trackId) !== null;
}

async function createUserTrack(attributes) {
    try {
        return await UserTrack.create({ ...attributes });
    } catch (e) {
        throw new FunctionalException(`${ERROR_CREATE_USER_TRACK}`, 500)
    }
}

async function createUserTrackIfNotExist(userId, trackId, attributes) {
    if (await isUserTrackExisting(userId, trackId)) {
        return await getUserTrackByIds(userId, trackId);
    }
    return await createUserTrack({ id_user: userId, id_track: trackId, ...attributes });
}

async function updateUserTrack(userId, trackId, attributes) {
    try {
        return await UserTrack.update({ ...attributes }, { where: { id_user: userId, id_track: trackId }});
    } catch (e) {
        throw new FunctionalException(`${ERROR_UPDATE_USER_TRACK} User id: ${userId} | Track id : ${trackId}`, 500)
    }
}

async function createOrUpdateUserTrack(userId, trackId, attributes) {
    if (await isUserTrackExisting(userId, trackId)) {
        return await updateUserTrack(userId, trackId, attributes);
    }
    return await createUserTrack({ id_user: userId, id_track: trackId, ...attributes });
}

module.exports = {
    getUserTrackByIds, isUserTrackExisting, createUserTrack,
    createUserTrackIfNotExist, updateUserTrack, createOrUpdateUserTrack
}