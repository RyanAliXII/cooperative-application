"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.query(`
    DROP VIEW IF EXISTS ranking_view;
    CREATE OR REPLACE VIEW ranking_view AS 
    SELECT  rankings.cooperative_id, rankings.category_id, rankings.criteria_id,
    (	
    ( CASE WHEN COALESCE(dcp.financial_performance_points, 0) = 0 THEN
     rankings.financial_performance_points ELSE COALESCE(dcp.financial_performance_points, 0) END ) 
     + 
      (CASE WHEN COALESCE(dcp.org_management_points, 0) = 0 THEN 
      rankings.org_mgmt_points ELSE COALESCE(dcp.org_management_points, 0) END ) + COALESCE(field_points.points, 0)) as points, 
      rankings.org_mgmt_points, 
	  field_points.points as field_points,
      rankings.financial_performance_points, 
      DENSE_RANK() OVER(
      PARTITION BY rankings.category_id ORDER BY (
      ( CASE WHEN COALESCE(dcp.financial_performance_points, 0) = 0 THEN
      rankings.financial_performance_points ELSE COALESCE(dcp.financial_performance_points, 0) END ) 
      + 
    (CASE WHEN COALESCE(dcp.org_management_points, 0) = 0 THEN 
      rankings.org_mgmt_points ELSE COALESCE(dcp.org_management_points, 0) END) + COALESCE(field_points.points, 0)) DESC
          ) rank_position,
      COALESCE(dcp.financial_performance_points, 0) as overriden_financial_performance_points,
    COALESCE(dcp.org_management_points, 0) as overriden_org_management_points
    FROM (SELECT 
    cooperative.category_id,
    criteria.id as criteria_id,
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
    LEFT JOIN default_criteria_point as dcp on rankings.cooperative_id = dcp.cooperative_id and rankings.category_id = dcp.category_id
    LEFT JOIN (SELECT cooperative_id, SUM(points) as points from criteria_field_point group by cooperative_id) as 
    field_points on rankings.cooperative_id = field_points.cooperative_id
    `);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.sequelize.query(`
        DROP VIEW IF EXISTS ranking_view;
    `);
  },
};
