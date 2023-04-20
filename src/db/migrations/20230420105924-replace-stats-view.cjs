"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.query(`
  DROP VIEW IF EXISTS stats_view;
  CREATE OR REPLACE VIEW stats_view AS 
  SELECT cooperative.id as cooperative_id, cooperative.name as cooperative_name, 
  COALESCE(fl.interest, 0) as loan_interest, 
  COALESCE(share.shares, 0) as shares, 
  COALESCE(saving.savings, 0) as savings,
  COALESCE(dl.loan, 0) as loan,
  COALESCE(fl.interest, 0) + COALESCE(share.shares, 0)  + COALESCE(saving.savings, 0) + COALESCE(registration.fees, 0) as assets,
COALESCE(registration.fees, 0) as registration_fees,
  ((COALESCE(fl.interest, 0) + COALESCE(share.shares, 0) + COALESCE(saving.savings, 0) + COALESCE(registration.fees, 0)) - COALESCE(dl.loan, 0) ) as liquidity
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
LEFT JOIN (
    SELECT cooperative_id, COALESCE(SUM(amount), 0) as savings from saving where type ='Deposit' AND deleted_at is null GROUP BY cooperative_id) 
    as saving on cooperative.id = saving.cooperative_id
LEFT JOIN (
    SELECT cooperative_id, COALESCE(SUM(registration_fee), 0) as fees from member  where approved_at is not null GROUP BY cooperative_id) 
    as registration on cooperative.id = registration.cooperative_id
  
  `);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.sequelize.query("DROP VIEW IF EXISTS stats_view");
  },
};
