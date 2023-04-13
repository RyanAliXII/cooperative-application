import { json } from "@sveltejs/kit";
import type { RequestHandler } from "../$types";
import { sequelize } from "$lib/models/sequelize";
import { StatusCodes } from "http-status-codes";

export const GET: RequestHandler = async ({ cookies, locals }) => {
  try {
    const { session } = locals.session;
    const coopId = session.data?.cooperative?.id;
    const [result, _] = await sequelize.query(
      "SELECT SUM(mshare.total) as total FROM member_share as mshare inner join member on member_id = member.id where cooperative_id = :coopId GROUP BY cooperative_id ",
      {
        replacements: {
          coopId,
        },
      }
    );

    return json({
      message: "Shares total fetched.",
      data: {
        shares: result?.[0] ?? { total: 0 },
      },
    });
  } catch (error) {
    console.log(error);
    return json(
      {
        message: "unknown error occured.",
        data: {
          shares: { total: 0 },
        },
      },
      { status: StatusCodes.INTERNAL_SERVER_ERROR }
    );
  }
};
