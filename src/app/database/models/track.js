'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Track extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    };
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
        sequelize,
        modelName: 'Track',
        timestamps: false
    });
    return Track;
};