'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class TrackArtist extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) { }
    };
    TrackArtist.init({
        id_artist: {
            type: DataTypes.STRING(22),
            allowNull: false,
            primaryKey: true,
            references: {
                model: 'Artist',
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
        }
    }, {
        sequelize,
        modelName: 'TrackArtist',
        timestamps: false
    });
    return TrackArtist;
};