import { Prisma, Track } from "@prisma/client"
import { FunctionalException } from "../exception/custom-exceptions"
import { prisma } from "../database/database-manager"

const ERROR_GET_TRACK: string = 'Erreur lors de la récupération de la musique.'
const ERROR_GET_TRACKS: string = 'Erreur lors de la récupération de musiques.'
const ERROR_CREATE_TRACK: string = 'Erreur lors de la création de la musique.'
const ERROR_GET_TRACKS_OF_PLAYLIST: string = 'Erreur lors de la récupération des musiques de la playlist.'

export async function getTrackById(id: string): Promise<Track | null> {
    try {
        return await prisma.track.findFirst({ where: { id } })
    } catch (err: any) {
        throw new FunctionalException(`${ERROR_GET_TRACK} Id: ${id}`, 500)
    }
}

export async function getTracksByIds(ids: string[]): Promise<Track[]> {
    try {
        return await prisma.track.findMany({
            where: {
                id: {
                    in: ids
                }
            }
        })
    } catch (err: any) {
        throw new FunctionalException(`${ERROR_GET_TRACKS} Ids: ${ids.join(', ')}`, 500)
    }
}

export async function isTrackExisting(id: string): Promise<boolean> {
    return await getTrackById(id) != null
}

export async function createTrack(attributes: Prisma.TrackCreateInput): Promise<Track> {
    try {
        return await prisma.track.create({
            data: { ...attributes }
        })
    } catch (err: any) {
        throw new FunctionalException(`${ERROR_CREATE_TRACK}`, 500)
    }
}

export async function createTrackIfNotExist(id: string, attributes: Prisma.TrackCreateInput) {
    const track: Track | null = await getTrackById(id)
    return track != null
        ? track
        : await createTrack({ ...attributes, id })
}

export async function getTracksOfPlaylist(idPlaylist: string): Promise<Track[]> {
    try {
        return await prisma.track.findMany({
            where: {
                playlists: {
                    some: {
                        idPlaylist
                    }
                }
            }
        })
    } catch (err: any) {
        throw new FunctionalException(`${ERROR_GET_TRACKS_OF_PLAYLIST} Playlist id: ${idPlaylist}`, 500)
    }
}
