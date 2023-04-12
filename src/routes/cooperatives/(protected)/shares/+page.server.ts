import { Member, Session, Shares, SharesLog } from "$lib/models/model";
import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { StatusCodes } from "http-status-codes";
import { sequelize } from "$lib/models/sequelize";
import { getSessionMetadata } from "$lib/internal/session";

export const load: PageServerLoad = async (event) => {
  const { session } = await getSessionMetadata(event);

  const coopId = session.data?.cooperative?.id;

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
