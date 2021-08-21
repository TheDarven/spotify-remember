'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Track extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            Track.belongsToMany(models.User, {
                through: 'UserTracks',
                as: 'users',
                foreignKey: 'id_track',
                otherKey: 'id_user'
            });

            Track.belongsToMany(models.Artist, {
                through: 'TrackArtists',
                as: 'artists',
                foreignKey: 'id_track',
                otherKey: 'id_artist'
            });

            Track.belongsToMany(models.Playlist, {
                through: 'PlaylistTracks',
                as: 'playlists',
                foreignKey: 'id_track',
                otherKey: 'id_playlist'
            });
        }
    };
    Track.init({
        id: {
            type: DataTypes.STRING(22),
            allowNull: false,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING(200),
            allowNull: false,
        },
        uri: {
            type: DataTypes.STRING(250),
            allowNull: false,
        }
    }, {
        sequelize,
        modelName: 'Track',
        timestamps: false
    });
    return Track;
};