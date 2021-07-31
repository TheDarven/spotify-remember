const { Sequelize } = require('sequelize')

const sequelize = new Sequelize(process.env.DATABASE_DATABASE, process.env.DATABASE_USER, process.env.DATABASE_PASSWORD, {
    host: process.env.DATABASE_HOST,
    dialect: 'postgres',
    port: process.env.DATABASE_PORT
});

async function authenticate() {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

function getConnection() {
    return sequelize;
}

module.exports = { authenticate, getConnection }
