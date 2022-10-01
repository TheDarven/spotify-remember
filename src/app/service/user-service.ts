import { Prisma, User } from "@prisma/client"
import { FunctionalException } from "../exception/custom-exceptions"
import { prisma } from "../database/database-manager"

const ERROR_GET_USER: string = 'Erreur lors de la récupération de l\'utilisateur.'
const ERROR_GET_USERS: string = 'Erreur lors de la récupération de tout les utilisateurs.'
const ERROR_CREATE_USER: string = 'Erreur lors de la création de l\'utilisateur.'
const ERROR_UPDATE_USER: string = 'Erreur lors de la modification de l\'utilisateur.'

export async function getUserById(id: string): Promise<User | null> {
    try {
        return await prisma.user.findFirst({ where: { id } })
    } catch (err: any) {
        throw new FunctionalException(`${ERROR_GET_USER} Id: ${id}`, 500)
    }
}

export async function getAllUsers(): Promise<User[]> {
    let users: User[] | null

    try {
        users = await prisma.user.findMany()
    } catch (err: any) {
        throw new FunctionalException(`${ERROR_GET_USERS}`, 500)
    }

    if (!users) {
        throw new FunctionalException(`${ERROR_GET_USERS}`, 500)
    }

    return users
}

export async function isUserExisting(id: string): Promise<boolean> {
    return await getUserById(id) != null
}

export async function createUser(attributes: Prisma.UserCreateInput): Promise<User> {
    try {
        return await prisma.user.create({
            data: { ...attributes }
        })
    } catch (err: any) {
        console.log(err)
        throw new FunctionalException(`${ERROR_CREATE_USER}`, 500)
    }
}

export async function createUserIfNotExist(id: string, attributes: Prisma.UserCreateInput): Promise<User> {
    const user: User | null = await getUserById(id)
    return user != null
        ? user
        : await createUser({ ...attributes, id })
}

export async function updateUser(id: string, attributes: Prisma.UserUpdateInput): Promise<void> {
    try {
        await prisma.user.update({
            where: { id },
            data: { ...attributes }
    })
    } catch (err: any) {
        throw new FunctionalException(`${ERROR_UPDATE_USER} Id: ${id}`, 500)
    }
}

export async function createOrUpdateUser(id: string, attributes: Prisma.UserCreateInput): Promise<void> {
    if (await isUserExisting(id)) {
        await updateUser(id, attributes)
    } else {
        await createUser({ ...attributes, id })
    }
}
