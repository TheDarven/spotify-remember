'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Artist extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    };
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
        sequelize,
        modelName: 'Artist',
        timestamps: false
    });
    return Artist;
};