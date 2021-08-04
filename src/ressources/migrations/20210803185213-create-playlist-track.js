'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('PlaylistTrack', {
            id_playlist: {
                type: Sequelize.STRING(22),
                allowNull: false,
                primaryKey: true,
                references: {
                    model: 'Playlists',
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
            }
        });
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('PlaylistTrack');
    }
};