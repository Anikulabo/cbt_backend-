'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    // Remove columns if they exist
    await queryInterface.removeColumn('scores', 'CA');
    await queryInterface.removeColumn('scores', 'exam');
    
    // Add columns with new definitions
    await queryInterface.addColumn('scores', 'CA', {
      type: Sequelize.INTEGER,
      allowNull: true,  // Allow null values
      defaultValue: null  // Default value (optional, null is default)
    });

    await queryInterface.addColumn('scores', 'exam', {
      type: Sequelize.INTEGER,
      allowNull: true,  // Allow null values
      defaultValue: null  // Default value (optional, null is default)
    });
  },

  async down (queryInterface, Sequelize) {
    // Rollback the changes in the down function
    await queryInterface.removeColumn('scores', 'CA');
    await queryInterface.removeColumn('scores', 'exam');
    
    // Optionally, add the columns back with the old definitions if needed
    await queryInterface.addColumn('scores', 'CA', {
      type: Sequelize.INTEGER,
      // Include previous column settings here if any
    });

    await queryInterface.addColumn('scores', 'exam', {
      type: Sequelize.INTEGER,
      // Include previous column settings here if any
    });
  }
};
