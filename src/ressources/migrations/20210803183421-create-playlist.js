module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Playlists', {
            id: {
                type: Sequelize.STRING(22),
                allowNull: false,
                primaryKey: true
            },
            id_user: {
                type: Sequelize.STRING(22),
                allowNull: false,
                references: {
                    model: 'Users',
                    key: 'id'
                }
            },
            name: {
                type: Sequelize.STRING(200),
                allowNull: false
            },
            month: {
                type: Sequelize.INTEGER(2)
            },
            year: {
                type: Sequelize.INTEGER(4)
            }
        });
    },
    down: async (queryInterface) => {
        await queryInterface.dropTable('Playlists');
    }
};
