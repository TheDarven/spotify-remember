const SpotifyWebApi = require('spotify-web-api-node');

let spotifyApi;

function initSpotifyApi() {
    spotifyApi = new SpotifyWebApi({
        clientId: process.env.SPOTIFY_CLIENT_ID,
        clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
        redirectUri: 'http://127.0.0.1:3000'
    });
}

function getSpotifyApi() {
    return spotifyApi;
}


/* const scopes = 'user-read-private user-read-email';
const url = 'https://accounts.spotify.com/authorize?response_type=code&client_id='
    + my_client_id + (scopes ? '&scope=' + encodeURIComponent(scopes) : '') + '&redirect_uri=' + encodeURIComponent(redirect_uri)); */

module.exports = { initSpotifyApi, getSpotifyApi };