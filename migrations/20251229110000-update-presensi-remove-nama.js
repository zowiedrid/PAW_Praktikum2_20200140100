'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Remove redundant nama column; rely on userId foreign key
    await queryInterface.removeColumn('Presensis', 'nama');

    // Add foreign key constraint to Users table for referential integrity
    await queryInterface.addConstraint('Presensis', {
      fields: ['userId'],
      type: 'foreign key',
      name: 'presensis_userId_fkey',
      references: {
        table: 'Users',
        field: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
  },

  async down(queryInterface, Sequelize) {
    // Remove FK constraint first
    try {
      await queryInterface.removeConstraint('Presensis', 'presensis_userId_fkey');
    } catch (err) {
      // ignore if constraint missing
    }

    // Recreate nama column for rollback
    await queryInterface.addColumn('Presensis', 'nama', {
      type: Sequelize.STRING,
      allowNull: false
    });
  }
};
