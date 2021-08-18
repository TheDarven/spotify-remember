const { FunctionalException } = require('../../exception/custom-exceptions')
const { Playlist } = require('../models/index')

const ERROR_GET_PLAYLIST = 'Erreur lors de la récupération de la playlist.';
const ERROR_CREATE_PLAYLIST = 'Erreur lors de la création de la playlist.';
const ERROR_UPDATE_PLAYLIST = 'Erreur lors de la modification de la playlist.';

async function getPlaylistByMonthYearAndUserId(month, year, userId) {
    try {
        return await Playlist.findOne({ where: { month, year, id_user: userId } });
    } catch (e) {
        throw new FunctionalException(`${ERROR_GET_PLAYLIST} Month: ${month} | Year: ${year} | User id: ${userId}`, 500)
    }
}

async function isPlaylistExisting(month, year, userId) {
    return await getPlaylistByMonthYearAndUserId(month, year, userId) !== null;
}

async function createPlaylist(attributes) {
    try {
        return await Playlist.create({ ...attributes });
    } catch (e) {
        throw new FunctionalException(`${ERROR_CREATE_PLAYLIST}`, 500)
    }
}

async function createPlaylistIfNotExist(month, year, userId, attributes) {
    if (await isPlaylistExisting(month, year, userId)) {
        return await getPlaylistByMonthYearAndUserId(month, year, userId);
    }
    return await createPlaylist({ month, year, id_user: userId, ...attributes });
}

async function updatePlaylist(month, year, userId, attributes) {
    try {
        return await Playlist.update(
            { ...attributes },
            { where: { month, year, id_user: userId } }
        );
    } catch (e) {
        throw new FunctionalException(`${ERROR_UPDATE_PLAYLIST} Month: ${month} | Year: ${year} | User id: ${userId}`, 500)
    }
}

async function createOrUpdatePlaylist(month, year, userId, attributes) {
    if (await isPlaylistExisting(month, year, userId)) {
        return await updatePlaylist(month, year, userId, attributes);
    }
    return await createPlaylist({ month, year, id_user: userId, ...attributes });
}

module.exports = {
    getPlaylistByMonthYearAndUserId, isPlaylistExisting, createPlaylist,
    createPlaylistIfNotExist, updatePlaylist, createOrUpdatePlaylist
}