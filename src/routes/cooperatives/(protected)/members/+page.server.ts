import { StatusCodes } from "http-status-codes";
import { redirect } from "@sveltejs/kit";
import { Member, Session } from "$lib/models/model";
import { Op } from "sequelize";
/** @type {import('./$types').PageServerLoad} */
export async function load({ cookies }) {
  const sid = cookies.get("coop_sid");
  if (!sid) {
    throw redirect(StatusCodes.SEE_OTHER, "/cooperative/login");
  }
  const session = await Session.findOne({
    where: {
      sid: sid,
    },
  });
  const coopId = session?.dataValues?.data?.cooperative?.id;
  try {
    const members = await Member.findAll({
      where: {
        cooperativeId: coopId,
        approvedAt: {
          [Op.not]: null,
        },
      },
    });
    return {
      members: members.map((d) => d.dataValues) ?? [],
    };
  } catch (error) {
    console.log(error);
    return {
      members: [],
    };
  }
}
