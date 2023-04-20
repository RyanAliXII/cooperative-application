import { Member, MemberAccount, Session } from "$lib/models/model";

export async function load({ cookies, params, locals }) {
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
}
