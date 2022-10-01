import SpotifyWebApi from "spotify-web-api-node"
import { createOrUpdateUser, getAllUsers } from "../service/user-service"
import { initSpotifyApi } from "../spotify/spotify-manager"
import { getTimestamp } from "../utils/utils"
import { User } from "@prisma/client"
import { SpotifyResponse } from "../model/SpotifyResponse"

export interface ManagedUser {
    id: string,
    spotifyApi: SpotifyWebApi,
    whenTokenExpires: number
}

// Les utilisateurs du context
let users: ManagedUser[] = []

/**
 * Permet d'ajouter un <b>utilisateur</b> au context.
 *
 * @param id
 * @param spotifyApi
 * @param whenTokenExpires
 */
export async function addUser(id: string, spotifyApi: SpotifyWebApi, whenTokenExpires: number): Promise<ManagedUser> {
    removeUser(id)

    await createOrUpdateUser(id, {
        id,
        refreshToken: spotifyApi.getRefreshToken()
    })

    const user: ManagedUser = {
        id, spotifyApi, whenTokenExpires
    }
    users.push(user)
    return user
}

/**
 * Permet de retirer un <b>utilisateur</b> au context.
 *
 * @param id
 */
export function removeUser(id: string): void {
    users = users.filter(user => user.id !== id)
}

export async function loadUsers(): Promise<void> {
    const users: User[] = await getAllUsers()

    let user: User
    for (user of users) {
        // Ignore les utilisateur sans refresh token
        if (user.refreshToken == null) {
            continue
        }

        const spotifyApi: SpotifyWebApi = initSpotifyApi()

        spotifyApi.setRefreshToken(user.refreshToken)

        const refreshAccessToken: SpotifyResponse<any> = await spotifyApi.refreshAccessToken()

        spotifyApi.setAccessToken(refreshAccessToken.body['access_token'])

        await addUser(user.id, spotifyApi, getTimestamp() + refreshAccessToken.body['expires_in'])
    }
}

export async function refreshTokenOfUser(user: ManagedUser): Promise<void> {
    const { spotifyApi } = user

    const refreshAccessToken: SpotifyResponse<any> = await spotifyApi.refreshAccessToken()

    spotifyApi.setAccessToken(refreshAccessToken.body['access_token'])

    user.whenTokenExpires = getTimestamp() + refreshAccessToken.body['expires_in']
}

export function getUsers(): ManagedUser[] {
    return users
}
