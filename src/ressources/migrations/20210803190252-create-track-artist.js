'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('TrackArtist', {
            id_artist: {
                type: Sequelize.STRING(22),
                allowNull: false,
                primaryKey: true,
                references: {
                    model: 'Artists',
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
        await queryInterface.dropTable('TrackArtist');
    }
};