'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Playlist extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            Playlist.belongsTo(models.User, {
                foreignKey: 'id_user'
            })
        }
    };
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
                model: 'User',
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
        sequelize,
        modelName: 'Playlist',
        timestamps: false
    });
    return Playlist;
};