const dotenv = require('dotenv')

dotenv.config()

const env = process.env.NODE_ENV?.trim() ?? 'development';

module.exports = { dotenv, env }
