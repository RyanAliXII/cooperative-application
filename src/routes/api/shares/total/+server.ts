import { json } from "@sveltejs/kit";
import type { RequestHandler } from "../$types";
import { StatusCodes } from "http-status-codes";
import { Member, Session, Shares } from "$lib/models/model";
import { sequelize } from "$lib/models/sequelize";

export const GET: RequestHandler = async ({ cookies }) => {
  const sid = cookies.get("coop_sid");

  try {
    const sessionModel = await Session.findOne({
      where: {
        sid: sid,
      },
    });

    if (!sessionModel) {
      return json(
        {
          message: "Invalid SID",
        },
        {
          status: StatusCodes.UNAUTHORIZED,
        }
      );
    }
    const session = sessionModel.get({ plain: true });
    const coopId = session?.data?.cooperative?.id;

    const [result, _] = await sequelize.query(
      "SELECT SUM(shares.total) as total FROM shares inner join member on member_id = member.id where cooperative_id = :coopId GROUP BY cooperative_id ",
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
  }
  return json({});
};
