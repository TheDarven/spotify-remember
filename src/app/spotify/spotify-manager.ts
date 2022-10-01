import SpotifyWebApi from 'spotify-web-api-node'
import { getUrl } from "../utils/url"

export function initSpotifyApi(): SpotifyWebApi {
    return new SpotifyWebApi({
        clientId: process.env.SPOTIFY_CLIENT_ID,
        clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
        redirectUri: `${getUrl()}spotify/callback`
    })
}
