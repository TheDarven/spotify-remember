const { DataTypes, Model } = require('sequelize')
const { getConnection } = require('../../database-manager')
const { Playlist } = require('../playlist/playlist-model')
const { Track } = require('../track/track-model')

class PlaylistTrack extends Model {}

PlaylistTrack.init({
    id_playlist: {
        type: DataTypes.STRING(22),
        allowNull: false,
        primaryKey: true,
        references: {
            model: Playlist,
            key: 'id'
        }
    },
    id_track: {
        type: DataTypes.STRING(22),
        allowNull: false,
        primaryKey: true,
        references: {
            model: Track,
            key: 'id'
        }
    }
}, {
    sequelize: getConnection(),
    modelName: 'PlaylistTrack',
    timestamps: false
});

Playlist.belongsToMany(Track, { through: PlaylistTrack, uniqueKey: 'id_playlist' })
Track.belongsToMany(Playlist, { through: PlaylistTrack, uniqueKey: 'id_track' })

module.exports = PlaylistTrack