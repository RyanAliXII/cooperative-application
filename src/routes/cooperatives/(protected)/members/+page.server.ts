import { StatusCodes } from "http-status-codes";
import { redirect } from "@sveltejs/kit";
import { Member, Session } from "$lib/models/model";
import { Op } from "sequelize";
import { getSessionMetadata } from "$lib/internal/session.js";
/** @type {import('./$types').PageServerLoad} */
export async function load(event) {
  const { session } = await getSessionMetadata(event);
  const coopId = session.data?.cooperative?.id;
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
