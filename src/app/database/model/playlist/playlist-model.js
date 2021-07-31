const { DataTypes, Model } = require('sequelize')
const { getConnection } = require('../../database-manager')
const { User } = require ('../user/user-model')

class Playlist extends Model {}

Playlist.init({
    id: {
        type: DataTypes.STRING(22),
        allowNull: false,
        primaryKey: true
    },
    id_user: {
        type: DataTypes.STRING(22),
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
    },
    name: {
        type: DataTypes.STRING(200),
        allowNull: false
    },
    month: {
        type: DataTypes.INTEGER(2)
    },
    year: {
        type: DataTypes.INTEGER(4)
    }
}, {
    sequelize: getConnection(),
    modelName: 'Playlist',
    timestamps: false
});

User.hasMany(Playlist)
Playlist.belongsTo(User, { foreignKey: 'user_id' })

module.exports = Playlist