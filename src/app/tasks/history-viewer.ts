import { SimpleIntervalJob, Task, ToadScheduler } from 'toad-scheduler'
import { isSameMonth } from '../utils/utils'
import { getUsers, ManagedUser, refreshTokenOfUser } from '../users/user-manager'
import { createArtistIfNotExist } from "../service/artist-service"
import { Artist, Context, Playlist, Prisma, Track, UserTrack } from "@prisma/client"
import { createContextIfNotExist, updateLastFetch } from "../service/context-service"
import { SpotifyResponse } from "../model/SpotifyResponse"
import { createUserTrack, getUserTrackByIds, isUserTrackExisting, updateUserTrack } from "../service/usertrack-service"
import { createTrack, getTrackById, getTracksByIds, isTrackExisting } from "../service/track-service"
import {
    addTracksIntoPlaylist,
    createPlaylist,
    getPlaylistByMonthYearAndUserId,
    isPlaylistExisting
} from "../service/playlist-service"
import { isInDevelopment } from "../utils/env-util"

interface PlaylistDate {
    month: number,
    year: number,
    userTracks: UserTrack[]
}

const JOB_INTERVAL: number = Number(process.env.TASK_DELAY) ?? 600

const scheduler: ToadScheduler = new ToadScheduler()

const jobs: SimpleIntervalJob[] = []

export function createJob(): void {
    const task: Task = new Task('last-track-task', lastPlayedTrackTask)

    const job: SimpleIntervalJob = new SimpleIntervalJob({ seconds: JOB_INTERVAL }, task)

    scheduler.addSimpleIntervalJob(job)

    jobs.push(job)
}

/**
 * La tâche de traitement des dernières musiques écoutées.
 *
 * @returns {Promise<void>}
 */
export async function lastPlayedTrackTask(): Promise<void> {

    const context: Context = await createContextIfNotExist()

    let user: ManagedUser
    for (user of getUsers()) {
        try {
            await refreshTokenOfUser(user)

            const lastTracks: SpotifyResponse<SpotifyApi.UsersRecentlyPlayedTracksResponse> =
                await user.spotifyApi.getMyRecentlyPlayedTracks({
                    after: new Date(context.lastFetch).getTime()
                })

            const lastTracksBody: SpotifyApi.UsersRecentlyPlayedTracksResponse = lastTracks.body

            const newUserTracks: UserTrack[] = []

            const playHistoryItems: SpotifyApi.PlayHistoryObject[] = lastTracksBody.items.reverse()

            let playHistoryItem: SpotifyApi.PlayHistoryObject
            for (playHistoryItem of playHistoryItems) {
                const newUserTrack: UserTrack | null = await processUserTrack(playHistoryItem, user)
                if (newUserTrack != null) {
                    newUserTracks.push(newUserTrack)
                }
            }

            const playlistDates: PlaylistDate[] = getPlaylistDatesOfTracks(newUserTracks)

            await createOrUpdatePlaylistDates(playlistDates, user)
        } catch (err: any) {
            console.log(err)
        }
    }
    await updateLastFetch(new Date())
}

/**
 * Permet d'obtenir la liste de la date des playlists des nouvelles musiques.
 *
 * @param newUserTracks
 * @returns {*[]}
 */
function getPlaylistDatesOfTracks(newUserTracks: UserTrack[]): PlaylistDate[] {
    const playlistDates: PlaylistDate[] = []

    let userTrack: UserTrack
    for (userTrack of newUserTracks) {
        const firstPlay: Date = new Date(userTrack.firstPlay)
        const month: number = firstPlay.getMonth() + 1
        const year: number = firstPlay.getFullYear()

        const playlistDatesMatches: PlaylistDate[] = playlistDates.filter(p => p.month === month && p.year === year)

        if (playlistDatesMatches.length === 0) {
            playlistDates.push({ month, year, userTracks: [userTrack] })
        } else {
            playlistDatesMatches[0].userTracks.push(userTrack)
        }
    }
    return playlistDates
}

/**
 * Permet d'ajouter les tracks dans les playlists en back et sur spotify.
 * Si une playlist n'existe pas, elle est créée.
 *
 * @param playlistDates
 * @param user
 * @returns {Promise<void>}
 */
async function createOrUpdatePlaylistDates(playlistDates: PlaylistDate[], user: ManagedUser): Promise<void> {
    // Créer les playlist
    let playlistDate: PlaylistDate
    for (playlistDate of playlistDates) {
        let playlist: Playlist | null

        if (await isPlaylistExisting(playlistDate.month, playlistDate.year, user.id)) {
            playlist = await getPlaylistByMonthYearAndUserId(playlistDate.month, playlistDate.year, user.id)
        } else {
            const formattedMonth: string = ("0" + playlistDate.month).slice(-2)
            let playlistName: string
            if (isInDevelopment()) {
                playlistName = `DEV - Découvertes ${formattedMonth}/${playlistDate.year}`
            } else {
                playlistName = `Découvertes ${formattedMonth}/${playlistDate.year}`
            }

            const spotifyPlaylist: SpotifyResponse<SpotifyApi.CreatePlaylistResponse> = await user.spotifyApi.createPlaylist(playlistName)
            const spotifyPlaylistBody: SpotifyApi.CreatePlaylistResponse = spotifyPlaylist.body

            playlist = await createPlaylist({
                id: spotifyPlaylistBody.id,
                user: {
                    connect: { id: user.id }
                },
                name: playlistName,
                month: playlistDate.month,
                year: playlistDate.year
            })
        }

        // Si l'objet playlist est invalide, aucun traitement ne peut être effectué
        if (playlist == null) {
            continue
        }

        // Ajoute les nouvelles musiques dans la playlist
        const idsTracks: string[] = playlistDate.userTracks.map((userTrack: UserTrack) => userTrack.idTrack)
        const addedTracksIds: string[] = await addTracksIntoPlaylist(idsTracks, playlist.id)

        let needSpotifyUpdate = addedTracksIds != null && addedTracksIds.length > 0

        if (needSpotifyUpdate) {
            // Met à jour la playlist sur Spotify
            const addedTracks: Track[] = await getTracksByIds(addedTracksIds)
            const addedTracksUris = addedTracks.map((addedTrack: Track) => addedTrack.uri)
            await user.spotifyApi.addTracksToPlaylist(playlist.id, addedTracksUris)
        }

        /* const tracks: Track[] = await playlist.getTracks() // getTracksOfPlaylist

        // addTracksIntoPlaylist(playlist.id, userTrack.idTracks)
        // needSpotifyUpdate = true
        let userTrack: UserTrack
        for (userTrack of playlistDate.userTracks) {
            if (tracks.filter(track => track.id === userTrack.id_track).length === 0) {
                await playlist.addTrack(userTrack.track)
                needSpotifyUpdate = true
            }
        } */

        /* const uris: string[] = playlistDate.userTracks.map(userTrack => userTrack.track.uri)

        if (needSpotifyUpdate) {
            await user.spotifyApi.addTracksToPlaylist(playlist.id, uris)
        } */
    }
}

/**
 * Permet d'ajouter l'écoute d'une musique à l'utilisateur.
 *
 * @param playHistoryItem L'entité musique écoutée de l'API spotify.
 * @param user L'utilisateur qui a écouté.
 * @returns {Promise<UserTrack|null>}
 */
async function processUserTrack(playHistoryItem: SpotifyApi.PlayHistoryObject, user: ManagedUser): Promise<UserTrack | null> {
    const track: Track | null = await processTrack(playHistoryItem.track)

    if (track == null) {
        return null
    }

    const playedAt: Date = new Date(playHistoryItem.played_at)

    if (await isUserTrackExisting(user.id, track.id)) {
        const userTrack: UserTrack | null = await getUserTrackByIds(user.id, track.id)

        if (userTrack != null && playedAt > userTrack.lastPlay) {
            await updateUserTrack(user.id, track.id, {
                nbListeningTotal: userTrack.nbListeningTotal + 1,
                lastPlay: playedAt,
                nbListeningFirstMonth: userTrack.nbListeningFirstMonth + Number(isSameMonth(userTrack.firstPlay, playedAt))
            })
        }
        return null
    } else {
        return await createUserTrack({
            user: {
                connect: { id: user.id }
            },
            track: {
                connect: { id: track.id }
            },
            firstPlay: playedAt,
            lastPlay: playedAt
        })
    }
}

/**
 * Permet de créer une musique si elle n'existe pas.
 *
 * @param responseTrack L'entité musique de l'API spotify.
 * @returns {Promise<Track|null>}
 */
async function processTrack(responseTrack: SpotifyApi.TrackObjectFull): Promise<Track | null> {
    let track: Track | null

    if (await isTrackExisting(responseTrack.id)) {
        track = await getTrackById(responseTrack.id)
    } else {
        const authors: Prisma.TrackArtistCreateWithoutTrackInput[] = []

        let responseArtist: SpotifyApi.ArtistObjectSimplified
        for (responseArtist of responseTrack.artists) {
            const artist: Artist = await processArtist(responseArtist)

            authors.push({
                artist: {
                    connect: { id: artist.id }
                }
            })
        }

        track = await createTrack({
            id: responseTrack.id,
            name: responseTrack.name,
            uri: responseTrack.uri,
            authors: {
                create: authors
            }
        })
    }

    return track
}

/**
 * Permet de créer ou récupérer un artiste.
 *
 * @param responseArtist L'entité artist de l'API spotify.
 * @returns {Promise<Artist>}
 */
async function processArtist(responseArtist: SpotifyApi.ArtistObjectSimplified): Promise<Artist> {
    return await createArtistIfNotExist(responseArtist.id, {
        id: responseArtist.id,
        name: responseArtist.name,
        uri: responseArtist.uri
    })
}
