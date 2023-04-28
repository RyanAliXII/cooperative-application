import { Member, MemberAccount } from "$lib/models/model";
import { sequelize } from "$lib/models/sequelize";
import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ cookies, params, locals }) => {
  try {
    const { session } = locals.session;
    const coopId = session.data?.cooperativeId;
    const accounts = await MemberAccount.findAll({
      attributes: {
        exclude: ["password"],
      },
      include: [
        {
          required: true,
          where: {
            cooperativeId: coopId,
            approvedAt: null,
            declinedAt: null,
          },
          model: Member,
        },
      ],
    });

    return {
      accounts: accounts?.map((a) => a.get({ plain: true })) ?? [],
    };
  } catch (error) {
    console.log(error);
    return {
      accounts: [],
    };
  }
};

export const actions: Actions = {
  approve: async ({ locals, request }) => {
    const formData = await request.formData();
    const { session } = locals.session;
    const memberId = formData.get("memberId");
    const coopId = session.data?.cooperativeId;

    await Member.update(
      {
        approvedAt: sequelize.fn("NOW"),
        declinedAt: null,
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
  decline: async ({ locals, request }) => {
    const formData = await request.formData();
    const { session } = locals.session;
    const memberId = formData.get("memberId");
    const coopId = session.data?.cooperativeId;

    await Member.update(
      {
        declinedAt: sequelize.fn("NOW"),
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
      message: "Membership has been declined.",
    };
  },
};
