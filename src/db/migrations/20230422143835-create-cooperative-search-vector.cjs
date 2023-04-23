"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.query(`
    ALTER TABLE IF EXISTS cooperative
    add COLUMN IF NOT EXISTS search_vector tsvector
  generated always as (
    setweight(to_tsvector('simple', name), 'A')   
    || ' ' ||
    setweight(to_tsvector('simple', registration_number), 'B')
    || ' ' ||
    setweight(to_tsvector('simple', initials ), 'C') 
  ) stored;
    
    `);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.sequelize.query(`
    ALTER TABLE IF EXISTS cooperative
    DROP COLUMN IF EXISTS search_vector;
    `);
  },
};
