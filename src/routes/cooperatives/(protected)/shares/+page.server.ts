import { Member, Session, Shares, SharesLog } from "$lib/models/model";
import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { StatusCodes } from "http-status-codes";
import { sequelize } from "$lib/models/sequelize";

export const load: PageServerLoad = async ({ cookies }) => {
  const sid = cookies.get("coop_sid");
  if (!sid) {
    throw redirect(StatusCodes.SEE_OTHER, "/cooperatives/login");
  }
  const sessionModel = await Session.findOne({
    where: {
      sid: sid,
    },
  });

  if (!sessionModel) {
    throw redirect(StatusCodes.SEE_OTHER, "/cooperatives/login");
  }
  const session = await sessionModel.get({ plain: true });
  const coopId = session?.data?.cooperative?.id;

  const [result, _] = await sequelize.query(
    "SELECT SUM(shares.total) as total FROM shares inner join member on member_id = member.id where cooperative_id = :coopId GROUP BY cooperative_id ",
    {
      replacements: {
        coopId,
      },
    }
  );

  const sharesLogModel = await SharesLog.findAll({
    where: {
      cooperativeId: coopId,
    },
    order: [["created_at", "desc"]],
    include: [
      {
        model: Member,
      },
    ],
  });

  return {
    sharesLogs: sharesLogModel.map((log) => log.get({ plain: true })) ?? [],
    shares: (result?.[0] as { total: string }) ?? 0,
  };
};
