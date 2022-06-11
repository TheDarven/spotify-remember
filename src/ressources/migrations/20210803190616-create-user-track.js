'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('UserTracks', {
            id_user: {
                type: Sequelize.STRING(22),
                allowNull: false,
                primaryKey: true,
                references: {
                    model: 'Users',
                    key: 'id'
                }
            },
            id_track: {
                type: Sequelize.STRING(22),
                allowNull: false,
                primaryKey: true,
                references: {
                    model: 'Tracks',
                    key: 'id'
                }
            },
            first_play: {
                type: Sequelize.DATE,
                allowNull: false
            },
            last_play: {
                type: Sequelize.DATE,
                allowNull: false
            },
            is_on_playlist: {
                type: Sequelize.BOOLEAN,
                defaultValue: true
            },
            nb_listening_total: {
                type: Sequelize.INTEGER,
                defaultValue: 1
            },
            nb_listening_first_month: {
                type: Sequelize.INTEGER,
                defaultValue: 1
            }
        });
    },
    down: async (queryInterface) => {
        await queryInterface.dropTable('UserTracks');
    }
};
