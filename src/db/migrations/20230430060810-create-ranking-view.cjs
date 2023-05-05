"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    queryInterface.sequelize.query(`
    DROP VIEW IF EXISTS ranking_view;
    CREATE OR REPLACE VIEW ranking_view AS 
    SELECT  cooperative_id, category_id,(financial_performance_points + org_mgmt_points) as points, org_mgmt_points,financial_performance_points, 
    DENSE_RANK() OVER(
    PARTITION BY category_id ORDER BY (financial_performance_points + org_mgmt_points) DESC
    ) rank_position
    FROM (SELECT 
    cooperative.category_id,
    cooperative.id as cooperative_id,
    max_values.assets as max_assets,
    max_values.members as max_members,
    CASE WHEN stats.assets = 0 OR max_values.assets = 0 then 0 else CAST(( stats.assets /  max_values.assets) 
    * criteria.financial_performance_points as INTEGER) end  as financial_performance_points,
    CASE WHEN stats.members = 0 OR  max_values.members  = 0 then 0 else CAST(CAST( stats.members as NUMERIC(10, 2)) / CAST(max_values.members as NUMERIC(10,2) ) * CAST(criteria.org_management_points as NUMERIC(10,2)) 
    - (((stats.exited_ratio/100 ) * criteria.org_management_points) / 2 ) as INTEGER)  end  as org_mgmt_points
    FROM cooperative
    INNER JOIN (
        SELECT cooperative_category_id as category_id, MAX(assets) as assets,  MAX(members)  as members  from stats_view GROUP BY cooperative_category_id
    ) as max_values ON cooperative.category_id = max_values.category_id
    INNER JOIN cooperative_category as category on cooperative.category_id = category.id
    INNER JOIN stats_view as stats on cooperative.id = stats.cooperative_id
    INNER JOIN cooperative_criteria as criteria on category.criteria_id = criteria.id ) as rankings
    `);
  },

  async down(queryInterface, Sequelize) {
    queryInterface.sequelize.query(`
     DROP VIEW IF EXISTS ranking_view;
    `);
  },
};
