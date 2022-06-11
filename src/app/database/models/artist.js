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
            Artist.belongsToMany(models.Track, {
                through: 'TrackArtists',
                as: 'tracks',
                foreignKey: 'id_artist',
                otherKey: 'id_track'
            });
        }
    }
    Artist.init({
        id: {
            type: DataTypes.STRING(22),
            allowNull: false,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING(200),
            allowNull: false
        },
        uri: {
            type: DataTypes.STRING(250),
            allowNull: false
        }
    }, {
        sequelize,
        modelName: 'Artist',
        timestamps: false
    });
    return Artist;
};
