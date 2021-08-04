'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Users', {
            id: {
                type: Sequelize.STRING(22),
                allowNull: false,
                primaryKey: true
            },
            enable: {
                type: Sequelize.BOOLEAN,
                defaultValue: true
            },
            refresh_token: {
                type: Sequelize.STRING(200)
            }
        });
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('Users');
    }
};