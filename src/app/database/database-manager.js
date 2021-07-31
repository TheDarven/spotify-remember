const { Sequelize } = require('sequelize')

const sequelize = new Sequelize('spotify-remember', 'spotify', 'spotify', {
    host: 'localhost',
    dialect: 'postgres',
    port: '5432'
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
