'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Ensure correct columns and constraints on Users table
    await queryInterface.changeColumn('Users', 'nama', {
      type: Sequelize.STRING,
      allowNull: false,
    });

    await queryInterface.changeColumn('Users', 'email', {
      type: Sequelize.STRING,
      allowNull: false,
    });

    // Add unique constraint explicitly (in case it's missing or misconfigured)
    const [indexes] = await queryInterface.sequelize.query('SHOW INDEX FROM `Users`');
    const hasEmailUnique = indexes && indexes.some((idx) => idx.Column_name === 'email' && idx.Non_unique === 0);
    if (!hasEmailUnique) {
      await queryInterface.addConstraint('Users', {
        fields: ['email'],
        type: 'unique',
        name: 'users_email_unique'
      });
    }

    await queryInterface.changeColumn('Users', 'password', {
      type: Sequelize.STRING,
      allowNull: false,
    });

    await queryInterface.changeColumn('Users', 'role', {
      type: Sequelize.ENUM('mahasiswa', 'admin'),
      allowNull: false,
      defaultValue: 'mahasiswa',
    });

    // Add sensible defaults for timestamps to avoid NOT NULL insert errors
    await queryInterface.changeColumn('Users', 'createdAt', {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    });

    await queryInterface.changeColumn('Users', 'updatedAt', {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
    });
  },

  async down(queryInterface, Sequelize) {
    // Revert to a more permissive schema (no defaults, allow null email)
    await queryInterface.changeColumn('Users', 'nama', {
      type: Sequelize.STRING,
      allowNull: false,
    });

    await queryInterface.changeColumn('Users', 'email', {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: null,
    });

    // Remove unique constraint if exists
    try {
      await queryInterface.removeConstraint('Users', 'users_email_unique');
    } catch (e) {
      // ignore if constraint not present
    }

    await queryInterface.changeColumn('Users', 'password', {
      type: Sequelize.STRING,
      allowNull: false,
    });

    await queryInterface.changeColumn('Users', 'role', {
      type: Sequelize.ENUM('mahasiswa', 'admin'),
      allowNull: false,
      defaultValue: 'mahasiswa',
    });

    await queryInterface.changeColumn('Users', 'createdAt', {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: null,
    });

    await queryInterface.changeColumn('Users', 'updatedAt', {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: null,
    });
  }
};