module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Contexts', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            last_fetch: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.NOW
            }
        });
    },
    down: async (queryInterface) => {
        await queryInterface.dropTable('Contexts');
    }
};
