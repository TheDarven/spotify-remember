import { prisma } from "../database/database-manager"
import { Prisma } from "@prisma/client"
import { FunctionalException } from "../exception/custom-exceptions"

const ERROR_CREATE_PLAYLIST_TRACKS: string = 'Erreur lors de l\'ajout de musiques à la playlist.'

export async function createPlaylistTracks(idPlaylist: string, idsTracks: string[]): Promise<number> {
    try {
        const createData: Prisma.PlaylistTrackCreateManyInput[] = idsTracks.map((idTrack: string) => {
            return {
                idTrack,
                idPlaylist
            }
        })

        const { count } = await prisma.playlistTrack.createMany({ data: createData })

        return count
    } catch (err: any) {
        throw new FunctionalException(`${ERROR_CREATE_PLAYLIST_TRACKS} Playlist id : ${idPlaylist} | Tracks ids : ${idsTracks.join(', ')}`, 500)
    }
}
