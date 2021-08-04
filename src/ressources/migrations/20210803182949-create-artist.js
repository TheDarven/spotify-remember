'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Artists', {
            id: {
                type: Sequelize.STRING(22),
                allowNull: false,
                primaryKey: true
            },
            name: {
                type: Sequelize.STRING(200),
                allowNull: false
            }
        });
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('Artists');
    }
};