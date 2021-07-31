const { DataTypes, Model } = require('sequelize')
const { getConnection } = require('../../database-manager')

class Artist extends Model {}

Artist.init({
    id: {
        type: DataTypes.STRING(22),
        allowNull: false,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING(200),
        allowNull: false
    }
}, {
    sequelize: getConnection(),
    modelName: 'Artist',
    timestamps: false
});

module.exports = Artist