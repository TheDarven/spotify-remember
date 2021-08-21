const express = require('express')
const router = express.Router()

const endpointSpotify = require('./spotify/endpoint-spotify')

router.use('/spotify', endpointSpotify);

module.exports = router