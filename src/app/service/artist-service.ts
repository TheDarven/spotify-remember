import { FunctionalException } from "../exception/custom-exceptions"
import { Artist, Prisma } from "@prisma/client"
import { prisma } from "../database/database-manager"

const ERROR_GET_ARTIST: string = 'Erreur lors de la récupération de l\'artiste.'
const ERROR_CREATE_ARTIST: string = 'Erreur lors de la création de l\'artiste.'

export async function getArtistById(id: string): Promise<Artist | null> {
    try {
        return await prisma.artist.findFirst({ where: { id } })
    } catch (err: any) {
        throw new FunctionalException(`${ERROR_GET_ARTIST} Id: ${id}`, 500)
    }
}

export async function isArtistExisting(id: string): Promise<boolean> {
    return await getArtistById(id) != null
}

export async function createArtist(attributes: Prisma.ArtistCreateInput): Promise<Artist> {
    try {
        return await prisma.artist.create({
            data: { ...attributes }
        })
    } catch (err: any) {
        throw new FunctionalException(`${ERROR_CREATE_ARTIST}`, 500)
    }
}

export async function createArtistIfNotExist(id: string, attributes: Prisma.ArtistCreateInput): Promise<Artist> {
    const artist: Artist | null = await getArtistById(id)
    return artist != null
        ? artist
        : await createArtist({ ...attributes, id })
}
