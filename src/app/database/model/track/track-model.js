const { DataTypes, Model } = require('sequelize')
const { getConnection } = require('../../database-manager')

class Track extends Model {}

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
    sequelize: getConnection(),
    modelName: 'Track',
    timestamps: false
});

module.exports = Track