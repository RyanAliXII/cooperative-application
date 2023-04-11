"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    return queryInterface.sequelize.query(`
    ALTER TABLE IF EXISTS member
    add COLUMN IF NOT EXISTS search_vector tsvector
  generated always as (
    setweight(to_tsvector('simple', surname), 'A')   
    || ' ' ||
    setweight(to_tsvector('simple', given_name), 'B')
    || ' ' ||
    setweight(to_tsvector('simple', middle_name ), 'C') 
) stored;
    `);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeColumn("member", "search_vector");
  },
};
