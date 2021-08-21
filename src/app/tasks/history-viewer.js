const { ToadScheduler, SimpleIntervalJob, Task } = require('toad-scheduler')
const { isSameMonth } = require('../utils/utils')
const { refreshTokenOfUser, getUsers } = require('../users/user-manager')
const { isTrackExisting, getTrackById, createTrack } = require('../database/helpers/track-helper')
const { isArtistExisting, getArtistById, createArtist } = require('../database/helpers/artist-helper')
const { isUserTrackExisting, getUserTrackByIds, updateUserTrack, createUserTrack } = require('../database/helpers/usertrack-helper')
const { getContext, updateLastFetch } = require('../database/helpers/context-helper')
const { isPlaylistExisting, getPlaylistByMonthYearAndUserId, createPlaylist } = require('../database/helpers/playlist-helper')

const scheduler = new ToadScheduler()
const jobs = [];

const JOB_INTERVAL = process.env.TASK_DELAY;

function createJob() {
    const task = new Task('last-track-task', lastPlayedTrackTask)
    const job = new SimpleIntervalJob({ seconds: JOB_INTERVAL }, task)
    scheduler.addSimpleIntervalJob(job)

    jobs.push(job)
}

/**
 * La tâche de traitement des dernières musiques écoutées.
 *
 * @returns {Promise<void>}
 */
async function lastPlayedTrackTask() {

    const context = await getContext();

    for (const user of getUsers()) {
        try {
            await refreshTokenOfUser(user);

            const lastTracks = await user.spotifyApi.getMyRecentlyPlayedTracks({
                after: new Date(context.last_fetch).getTime()
            });
            const response = lastTracks.body;

            const newUserTracks = [];
            response.items = response.items.reverse();
            for (const item of response.items) {
                const newUserTrack = await processUserTrack(item, user);
                if (newUserTrack) {
                    newUserTracks.push(newUserTrack);
                }
            }

            const playlistDates = getPlaylistDatesOfTracks(newUserTracks);

            await createOrUpdatePlaylistDates(playlistDates, user);
        } catch (e) {
            console.log(e);
        }
    }
    await updateLastFetch(new Date());
}

/**
 * Permet d'obtenir la liste de la date des playlists des nouvelles musiques.
 *
 * @param newTracks
 * @returns {*[]}
 */
function getPlaylistDatesOfTracks(newUserTracks) {
    const playlistDates = [];
    for (const userTrack of newUserTracks) {
        const firstPlay = new Date(userTrack.first_play);
        const month = firstPlay.getMonth();
        const year = firstPlay.getFullYear();

        const playlistDatesMatches = playlistDates.filter(p => p.month === month && p.year === year);

        if (playlistDatesMatches.length === 0) {
            playlistDates.push({ month, year, userTracks: [userTrack] });
        } else {
            playlistDatesMatches[0].userTracks.push(userTrack);
        }
    }
    return playlistDates;
}

/**
 * Permet d'ajouter les tracks dans les playlists en back et sur spotify.
 * Si une playlist n'existe pas, elle est créée.
 *
 * @param playlistDates
 * @param user
 * @returns {Promise<void>}
 */
async function createOrUpdatePlaylistDates(playlistDates, user) {
    // Créer les playlist
    for (const playlistDate of playlistDates) {
        let playlist;
        let needSpotifyUpdate = false;

        if (await isPlaylistExisting(playlistDate.month, playlistDate.year, user.id)) {
            playlist = await getPlaylistByMonthYearAndUserId(playlistDate.month, playlistDate.year, user.id);
        } else {
            const formattedMonth = ("0" + playlistDate.month).slice(-2);

            const playlistName = `Découvertes ${formattedMonth}/${playlistDate.year}`;
            let spotifyPlaylist = await user.spotifyApi.createPlaylist(playlistName);
            spotifyPlaylist = spotifyPlaylist.body;

            playlist = await createPlaylist( {
                id: spotifyPlaylist.id,
                id_user: user.id,
                name: playlistName,
                month: playlistDate.month,
                year: playlistDate.year
            });
        }

        const tracks = await playlist.getTracks();

        for (const userTrack of playlistDate.userTracks) {
            if (tracks.filter(track => track.id === userTrack.id_track).length === 0) {
                playlist.addTrack(userTrack.track);
                needSpotifyUpdate = true;
            }
        }

        const uris = playlistDate.userTracks.map(userTrack => userTrack.track.uri);

        if (needSpotifyUpdate) {
            await user.spotifyApi.addTracksToPlaylist(playlist.id, uris);
        }
    }
}

/**
 * Permet d'ajouter l'écoute d'une musique à l'utilisateur.
 *
 * @param item L'entité musique écoutée de l'API spotify.
 * @param user L'utilisateur qui a écouté.
 * @returns {Promise<*|undefined>}
 */
async function processUserTrack(item, user) {
    const track = await processTrack(item.track);

    const playedAt = new Date(item.played_at);
    if (await isUserTrackExisting(user.id, track.id)) {
        const userTrack = await getUserTrackByIds(user.id, track.id);

        if (playedAt > userTrack.last_play) {
            await updateUserTrack(user.id, track.id, {
                nb_listening_total: userTrack.nb_listening_total + 1,
                last_play: playedAt,
                nb_listening_first_month: userTrack.nb_listening_first_month + isSameMonth(userTrack.first_play, playedAt)
            });
        }
        return undefined;
    } else {
        const userTrack = await createUserTrack({
            id_user: user.id,
            id_track: track.id,
            first_play: playedAt,
            last_play: playedAt
        });
        userTrack.track = track;
        return userTrack;
    }
}

/**
 * Permet de créer une musique si elle n'existe pas.
 *
 * @param responseTrack L'entité musique de l'API spotify.
 * @returns {Promise<void>}
 */
async function processTrack(responseTrack) {
    const { id, name, uri } = responseTrack;

    let track;
    if (await isTrackExisting(id)) {
        track = await getTrackById(id);
    } else {
        track = await createTrack({ id, name, uri });

        const artists = [];
        for (const responseArtist of responseTrack.artists) {
            artists.push(await processArtist(responseArtist, track));
        }

        track.addArtists(artists);
    }
    return track;
}

/**
 * Permet de créer ou récupérer un artiste.
 *
 * @param responseArtist L'entité artist de l'API spotify.
 * @returns {Promise<void>}
 */
async function processArtist(responseArtist) {
    const { id, name, uri } = responseArtist;

    let artist;
    if (await isArtistExisting(id)) {
        artist = await getArtistById(id);
    } else {
        artist = await createArtist({ id, name, uri });
    }
    return artist;
}

module.exports = { createJob, process };