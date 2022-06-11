'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class UserTrack extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate() {
            // define association here
        }
    }
    UserTrack.init({
        id_user: {
            type: DataTypes.STRING(22),
            allowNull: false,
            primaryKey: true,
            references: {
                model: 'User',
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
        sequelize,
        modelName: 'UserTrack',
        timestamps: false
    });
    return UserTrack;
};
