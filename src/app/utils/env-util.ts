import { config } from 'dotenv'

config()

export const env = process.env.NODE_ENV?.trim() ?? 'development'

export function isInDevelopment() {
    return env === 'development'
}

/**
 * Vérifie si un identifiant d'utilisateur Spotify est présent dans
 * la liste des utilisateurs autorisés dans l'application (env.ALLOWED_USERS_IDS).
 *
 * @param userId L'identifiant Spotify de l'utilisateur.
 */
export function isAllowedUser(userId: string): boolean {
    const allowedUsersIds: string | undefined = process.env.ALLOWED_USERS_IDS
    if (allowedUsersIds == null) {
        return false
    }

    return allowedUsersIds.split(',').includes(userId)
}
