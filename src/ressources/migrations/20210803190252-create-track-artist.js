module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('TrackArtists', {
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
        }, {
            timestamps: false
        });
    },
    down: async (queryInterface) => {
        await queryInterface.dropTable('TrackArtists');
    }
};
