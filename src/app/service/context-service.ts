import { FunctionalException } from "../exception/custom-exceptions"
import { prisma } from "../database/database-manager"
import { Context } from "@prisma/client"

const ERROR_GET_CONTEXT: string = 'Erreur lors de la récupération du context.'
const ERROR_CREATE_CONTEXT: string = 'Erreur lors de la création du context.'

const CONTEXT_ID: number = 1

export async function getContext(): Promise<Context | null> {
    try {
        return await prisma.context.findFirst({ where: { id: CONTEXT_ID }})
    } catch (err: any) {
        throw new FunctionalException(ERROR_GET_CONTEXT, 500)
    }
}

export async function isContextExisting(): Promise<boolean> {
    return await getContext() != null
}

export async function updateLastFetch(date: Date): Promise<void> {
    if (await isContextExisting()) {
        await prisma.context.update({
            where: { id: CONTEXT_ID },
            data: { lastFetch: date }
        })
        return
    } else {
        await prisma.context.create({
            data: { lastFetch: date }
        })
        return
    }
}

export async function createContext(): Promise<Context> {
    try {
        return  await prisma.context.create({
            data: { lastFetch: new Date() }
        })
    } catch (err: any) {
        throw new FunctionalException(`${ERROR_CREATE_CONTEXT}`, 500)
    }
}

export async function createContextIfNotExist(): Promise<Context> {
    let context: Context | null = await getContext()

    return context != null
        ? context
        : await createContext()
}
