import type { CooperativeStats } from "$lib/definitions/types";
import { sequelize } from "$lib/models/sequelize";
import { json, type RequestHandler } from "@sveltejs/kit";
import { StatusCodes } from "http-status-codes";
import { QueryTypes } from "sequelize";

export const GET: RequestHandler = async ({ locals }) => {
  const { session } = locals.session;
  const coopId = session.data?.cooperative?.id;

  try {
    const result = await sequelize.query(
      `SELECT  cooperative_id as "cooperativeId", cooperative_name as "cooperativeName", loan_interest as "loanInterest", shares, loan, liquidity, assets from stats_view where cooperative_id = :coopId LIMIT 1`,
      {
        type: QueryTypes.SELECT,
        replacements: {
          coopId,
        },
      }
    );
    if (result.length === 0) {
      return json({ message: "Not found" }, { status: StatusCodes.NOT_FOUND });
    }
    const stat = result[0] as CooperativeStats;
    stat.liquidity = Number(stat.liquidity);
    stat.loan = Number(stat.loan);
    stat.loanInterest = Number(stat.loanInterest);
    stat.shares = Number(stat.shares);
    stat.assets = Number(stat.assets);
    return json({
      message: "Cooperative stats have been fetched.",
      data: {
        stat: stat,
      },
    });
  } catch (error) {
    console.log(error);
    return json(
      { message: "Unknown error occured." },
      { status: StatusCodes.INTERNAL_SERVER_ERROR }
    );
  }
};
