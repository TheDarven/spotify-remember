const express = require('express')
const router = express.Router()

const spotifyController = require('./controller-spotify')

router.get('', (req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Hello World');
});

router.use('/spotify', spotifyController);

module.exports = router
