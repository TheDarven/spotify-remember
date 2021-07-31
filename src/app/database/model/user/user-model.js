const { DataTypes, Model } = require('sequelize')
const { getConnection } = require('../../database-manager')

class User extends Model {}

User.init({
    id: {
        type: DataTypes.STRING(22),
        allowNull: false,
        primaryKey: true
    }
}, {
    sequelize: getConnection(),
    modelName: 'User',
    timestamps: false
});

module.exports = User