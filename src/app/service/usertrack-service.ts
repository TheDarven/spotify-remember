import { Prisma, UserTrack } from "@prisma/client"
import { FunctionalException } from "../exception/custom-exceptions"
import { prisma } from "../database/database-manager"

const ERROR_GET_USER_TRACK: string = 'Erreur lors de la récupération d\'une musique d\'un utilisateur.'
const ERROR_CREATE_USER_TRACK: string = 'Erreur lors de la création de la musique d\'un utilisateur.'
const ERROR_UPDATE_USER_TRACK: string = 'Erreur lors de la modification de la musique d\'un l\'utilisateur.'

export async function getUserTrackByIds(idUser: string, idTrack: string): Promise<UserTrack | null> {
    try {
        return await prisma.userTrack.findFirst({ where: { idUser, idTrack } })
    } catch (err: any) {
        throw new FunctionalException(`${ERROR_GET_USER_TRACK} User id: ${idUser} | Track id : ${idTrack}`, 500)
    }
}

export async function isUserTrackExisting(idUser: string, idTrack: string): Promise<boolean> {
    return await getUserTrackByIds(idUser, idTrack) != null
}

export async function createUserTrack(attributes: Prisma.UserTrackCreateInput): Promise<UserTrack> {
    try {
        return await prisma.userTrack.create({
            data: { ...attributes }
        })
    } catch (err: any) {
        throw new FunctionalException(`${ERROR_CREATE_USER_TRACK}`, 500)
    }
}

export async function createUserTrackIfNotExist(idUser: string, idTrack: string, attributes: Prisma.UserTrackCreateInput): Promise<UserTrack> {
    const userTrack: UserTrack | null = await getUserTrackByIds(idUser, idTrack)

    return userTrack != null
        ? userTrack
        : await createUserTrack({
            ...attributes,
            user: {
                connect: { id: idUser }
            },
            track: {
                connect: { id: idTrack }
            }
        })
}

export async function updateUserTrack(idUser: string, idTrack: string, attributes: Prisma.UserTrackUpdateInput): Promise<void> {
    try {
        await prisma.userTrack.update({
            where: {
                idUser_idTrack: { idUser, idTrack }
            },
            data: { ...attributes }
        })
    } catch (err: any) {
        throw new FunctionalException(`${ERROR_UPDATE_USER_TRACK} User id: ${idUser} | Track id : ${idTrack}`, 500)
    }
}

export async function createOrUpdateUserTrack(idUser: string, idTrack: string, attributes: Prisma.UserTrackCreateInput): Promise<void> {
    if (await isUserTrackExisting(idUser, idTrack)) {
        await updateUserTrack(idUser, idTrack, attributes)
    } else {
        await createUserTrack({
            ...attributes,
            user: {
                connect: { id: idUser }
            },
            track: {
                connect: { id: idTrack }
            }
        })
    }
}
