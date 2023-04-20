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
    CREATE OR REPLACE VIEW stats_view AS 
    SELECT cooperative.id as cooperative_id, cooperative.name as cooperative_name, 
    COALESCE(fl.interest, 0) as loan_interest, 
    COALESCE(share.shares, 0) as shares, 
    COALESCE(dl.loan, 0) as loan,
    COALESCE(fl.interest, 0) + COALESCE(share.shares, 0) as assets,
    ((COALESCE(fl.interest, 0) + COALESCE(share.shares, 0)) - COALESCE(dl.loan, 0) ) as liquidity
    FROM cooperative
    LEFT JOIN (
      SELECT cooperative_id, COALESCE(SUM(interest), 0) as interest FROM loan where status = 
      'Finished' AND deleted_at is null GROUP BY cooperative_id) 
      as fl on cooperative.id = fl.cooperative_id 
    LEFT JOIN (
      SELECT cooperative_id, COALESCE(SUM(amount), 0) as shares from share where type ='Deposit' AND deleted_at is null GROUP BY cooperative_id) 
      as share on cooperative.id = share.cooperative_id  
    LEFT JOIN (
      SELECT cooperative_id, COALESCE(SUM(interest), 0) as interest, COALESCE(SUM(remaining_balance), 0) as loan  FROM loan where status = 
      'Disbursed' AND deleted_at is null GROUP BY cooperative_id) 
      as dl on cooperative.id = dl.cooperative_id 
    `);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.sequelize.query("DROP VIEW IF EXISTS stats_view");
  },
};
