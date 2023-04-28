import { Member } from "$lib/models/model";
import { Op } from "sequelize";
import type { PageServerLoad } from "./$types";
import type { Actions } from "@sveltejs/kit";
import { sequelize } from "$lib/models/sequelize";

export const load: PageServerLoad = async ({ locals }) => {
  const { session } = locals.session;
  const coopId = session.data?.cooperative?.id;
  try {
    const members = await Member.findAll({
      where: {
        cooperativeId: coopId,
        approvedAt: {
          [Op.not]: null,
        },
        exitedAt: null,
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
};

export const actions: Actions = {
  exit: async ({ locals, request }) => {
    const formData = await request.formData();
    const { session } = locals.session;
    const memberId = formData.get("memberId");
    const coopId = session.data?.cooperativeId;

    await Member.update(
      {
        exitedAt: sequelize.fn("NOW"),
        approvedAt: null,
      },
      {
        where: {
          cooperativeId: coopId,
          id: memberId,
        },
      }
    );

    return {
      error: false,
      success: true,
      message: "Membership has been approved.",
    };
  },
};
