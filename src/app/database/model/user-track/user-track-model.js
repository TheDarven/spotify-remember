const { DataTypes, Model } = require('sequelize')
const { getConnection } = require('../../database-manager')
const { User } = require('../user/user-model')
const { Track } = require('../track/track-model')

class UserTrack extends Model {}

UserTrack.init({
    id_user: {
        type: DataTypes.STRING(22),
        allowNull: false,
        primaryKey: true,
        references: {
            model: User,
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
    },
    first_play: {
        type: DataTypes.DATE,
        allowNull: false
    },
    last_play: {
        type: DataTypes.DATE,
        allowNull: false
    },
    is_on_playlist: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    nb_listening_total: {
        type: DataTypes.INTEGER,
        defaultValue: 1
    },
    nb_listening_first_month: {
        type: DataTypes.INTEGER,
        defaultValue: 1
    }
}, {
    sequelize: getConnection(),
    modelName: 'UserTrack',
    timestamps: false
});

User.belongsToMany(Track, { through: UserTrack, uniqueKey: 'id_user' })
Track.belongsToMany(User, { through: UserTrack, uniqueKey: 'id_track' })

module.exports = UserTrack