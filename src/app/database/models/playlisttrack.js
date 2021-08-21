'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class PlaylistTrack extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {

        }
    };
    PlaylistTrack.init({
        id_playlist: {
            type: DataTypes.STRING(22),
            allowNull: false,
            primaryKey: true,
            references: {
                model: 'Playlist',
                key: 'id'
            }
        },
        id_track: {
            type: DataTypes.STRING(22),
            allowNull: false,
            primaryKey: true,
            references: {
                model: 'Track',
                key: 'id'
            }
        }
    }, {
        sequelize,
        modelName: 'PlaylistTrack',
        timestamps: false
    });
    return PlaylistTrack;
};