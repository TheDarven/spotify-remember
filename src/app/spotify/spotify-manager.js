const SpotifyWebApi = require('spotify-web-api-node');
const { getUrl } = require('../main-manager')

function initSpotifyApi() {
    return new SpotifyWebApi({
        clientId: process.env.SPOTIFY_CLIENT_ID,
        clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
        redirectUri: `${getUrl()}spotify/callback`
    });
}

module.exports = { initSpotifyApi };