const { Sequelize } = require('sequelize')
const { env } = require('../utils/env-loader')
const config = require('../../ressources/config/sequelize')[env];

const sequelize = new Sequelize(process.env.DATABASE_DATABASE, process.env.DATABASE_USER, process.env.DATABASE_PASSWORD, config);

async function authenticate() {
    try {
        await sequelize.authenticate();
        console.log('\x1b[32m✔ \x1b[0mConnection has been established successfully.');
    } catch (error) {
        console.error('\x1b[31m❌ \x1b[0mUnable to connect to the database:', error);
    }
}

module.exports = { authenticate, sequelize }
