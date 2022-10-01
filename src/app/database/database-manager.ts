import { PrismaClient } from '@prisma/client'

export const prisma = new PrismaClient()

export async function authenticate(): Promise<void> {
    try {
        await prisma.$connect()
        console.log('\x1b[32m✔ \x1b[0mConnection has been established successfully.')
    } catch (error) {
        console.error('\x1b[31m❌ \x1b[0mUnable to connect to the database:', error)
    }
}
