import { Playlist, Prisma, Track } from "@prisma/client"
import { FunctionalException } from "../exception/custom-exceptions"
import { prisma } from "../database/database-manager"
import { getTracksOfPlaylist } from "./track-service"
import { createPlaylistTracks } from "./playlisttrack-service"

const ERROR_GET_PLAYLIST: string = 'Erreur lors de la récupération de la playlist.'
const ERROR_CREATE_PLAYLIST: string = 'Erreur lors de la création de la playlist.'
const ERROR_UPDATE_PLAYLIST: string = 'Erreur lors de la modification de la playlist.'
const ERROR_ADD_TRACKS_INTO_PLAYLIST: string = 'Erreur lors de l\'ajout de musiques à la playlist.'

export async function getPlaylistByMonthYearAndUserId(month: number, year: number, idUser: string): Promise<Playlist | null> {
    try {
        return await prisma.playlist.findFirst({ where: { month, year, idUser } })
    } catch (err: any) {
        throw new FunctionalException(`${ERROR_GET_PLAYLIST} Month: ${month} | Year: ${year} | User id: ${idUser}`, 500)
    }
}

export async function isPlaylistExisting(month: number, year: number, userId: string): Promise<boolean> {
    return await getPlaylistByMonthYearAndUserId(month, year, userId) != null
}

export async function createPlaylist(attributes: Prisma.PlaylistCreateInput): Promise<Playlist> {
    try {
        return await prisma.playlist.create({
            data: { ...attributes }
        })
    } catch (err: any) {
        throw new FunctionalException(`${ERROR_CREATE_PLAYLIST}`, 500)
    }
}

export async function createPlaylistIfNotExist(month: number, year: number, userId: string, attributes: Prisma.PlaylistCreateInput): Promise<Playlist> {
    const playlist: Playlist | null = await getPlaylistByMonthYearAndUserId(month, year, userId)

    return playlist != null
        ? playlist
        : await createPlaylist({
            ...attributes,
            month,
            year,
            user: { connect: { id: userId } }
        })
}

export async function updatePlaylist(month: number, year: number, idUser: string, attributes: Prisma.PlaylistUpdateInput): Promise<void> {
    try {
        await prisma.playlist.update({
            where: {
                month_year_idUser: { month, year, idUser }
            },
            data: { ...attributes }
        })
    } catch (err: any) {
        throw new FunctionalException(`${ERROR_UPDATE_PLAYLIST} Month: ${month} | Year: ${year} | User id: ${idUser}`, 500)
    }
}

export async function createOrUpdatePlaylist(month: number, year: number, idUser: string, attributes: Prisma.PlaylistCreateInput): Promise<void> {
    if (await isPlaylistExisting(month, year, idUser)) {
        await updatePlaylist(month, year, idUser, attributes)
    } else {
        await createPlaylist({
            ...attributes,
            month,
            year,
            user: { connect: { id: idUser } }
        })
    }
}

/**
 * Ajoute des musiques dans une playlist.
 * Ignore les musiques déjà présentes dans la playlist.
 *
 * @param idsTracks L'identifiant des musiques à ajouter.
 * @param idPlaylist L'identifiant de la playlist dans laquelle ajouter.
 *
 * @return string[] Identifiants des musiques ajoutées à la playlist.
 */
export async function addTracksIntoPlaylist(idsTracks: string[], idPlaylist: string): Promise<string[]> {
    try {
        // Récupère les musiques déjà présentent dans la playlist
        const existingPlaylistTracks: Track[] = await getTracksOfPlaylist(idPlaylist)

        // Filtre les musiques à ajouter
        const idsTracksAlreadyInPlaylist: string[] = existingPlaylistTracks.map((track: Track) => track.id)
        const idsTracksNotInPlaylist: string[] = idsTracks.filter((idTrack: string) => !idsTracksAlreadyInPlaylist.includes(idTrack))

        // Ajoute les musiques dans la playlist
        await createPlaylistTracks(idPlaylist, idsTracksNotInPlaylist)

        return idsTracksNotInPlaylist
    } catch (err: any) {
        throw new FunctionalException(`${ERROR_ADD_TRACKS_INTO_PLAYLIST} Playlist id : ${idPlaylist} | Tracks ids : ${idsTracks.join(', ')}`, 500)
    }
}
