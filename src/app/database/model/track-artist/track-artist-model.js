const { DataTypes, Model } = require('sequelize')
const { getConnection } = require('../../database-manager')
const { Artist } = require('../artist/artist-model')
const { Track } = require('../track/track-model')

class TrackArtist extends Model {}

TrackArtist.init({
    id_artist: {
        type: DataTypes.STRING(22),
        allowNull: false,
        primaryKey: true,
        references: {
            model: Artist,
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
    modelName: 'TrackArtist',
    timestamps: false
});

Artist.belongsToMany(Track, { through: TrackArtist, uniqueKey: 'id_artist' })
Track.belongsToMany(Artist, { through: TrackArtist, foreignKey: 'id_track' })

module.exports = TrackArtist