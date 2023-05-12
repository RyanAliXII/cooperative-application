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

    await queryInterface.sequelize.query(`
    DROP VIEW IF EXISTS member_stats_view;
    CREATE OR REPLACE VIEW member_stats_view AS 
    SELECT member.id as member_id, member.given_name,
    member.cooperative_id,
    member.surname, 
    COALESCE(saving.savings, 0) as savings_principal, 
    COALESCE(w_saving.savings, 0) as savings_withdrawal,
    COALESCE(saving.savings, 0) - COALESCE(w_saving.savings, 0) as savings,
    COALESCE(share.shares, 0) as shares_principal,
    COALESCE(w_share.shares, 0) as shares_withdrawal,
    COALESCE(share.shares, 0 ) - COALESCE(w_share.shares, 0) as shares,
    COALESCE(loan.total, 0) as disbursed_loan,
    COALESCE(f_loan.total, 0) as finished_loan,
    COALESCE(r_loan.total, 0) as requested_loan,
    COALESCE(a_loan.total, 0) as approved_loan,
    COALESCE(loan.interest, 0) as disbursed_loan_interest,
    COALESCE(f_loan.interest, 0) as finished_loan_interest,
    COALESCE(r_loan.interest, 0) as requested_loan_interest,
    COALESCE(a_loan.interest, 0) as approved_loan_interest
    FROM member
    LEFT JOIN (SELECT member_id, SUM(amount) as savings FROM saving where deleted_at is null and type = 'Deposit' group by member_id) 
    as saving on member.id = saving.member_id
    LEFT JOIN (SELECT member_id, SUM(amount) as savings FROM saving where deleted_at is null and type = 'Withdraw' group by member_id) 
    as w_saving on member.id = w_saving.member_id
    LEFT JOIN (SELECT member_id, SUM(amount) as shares FROM share where deleted_at is null and type = 'Deposit' group by member_id) 
    as share on member.id = share.member_id
    LEFT JOIN (SELECT member_id, SUM(amount) as shares FROM share where deleted_at is null and type = 'Withdraw' group by member_id) 
    as w_share on member.id = w_share.member_id
    LEFT JOIN (SELECT member_id, SUM(remaining_balance) as total, SUM(interest) as interest FROM loan where deleted_at is null and status = 'Disbursed' group by member_id) 
    as loan on member.id = loan.member_id
    LEFT JOIN (SELECT member_id, SUM(total_due) as total, SUM(interest) as interest FROM loan where deleted_at is null and status = 'Finished' group by member_id) 
    as f_loan on member.id = f_loan.member_id
    LEFT JOIN (SELECT member_id, SUM(total_due) as total, SUM(interest) as interest FROM loan where deleted_at is null and status = 'Requested' group by member_id) 
    as r_loan on member.id = r_loan.member_id
    LEFT JOIN (SELECT member_id, SUM(total_due) as total, SUM(interest) as interest FROM loan where deleted_at is null and status = 'Approved' group by member_id) 
    as a_loan on member.id = a_loan.member_id
    `);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.sequelize.query(
      "DROP VIEW IF EXISTS member_stats_view"
    );
  },
};
