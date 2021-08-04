'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class User extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    };
    User.init({
        id: {
            type: DataTypes.STRING(22),
            allowNull: false,
            primaryKey: true
        },
        enable: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        },
        refresh_token: {
            type: DataTypes.STRING(200)
        }
    }, {
        sequelize,
        modelName: 'User',
        timestamps: false
    });
    return User;
};