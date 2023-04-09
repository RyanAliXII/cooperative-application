import { Member, MemberAccount, Session } from "$lib/models/model";

/** @type {import('./$types').PageServerLoad} */
export async function load({ cookies, params }) {
  const coopSID = cookies.get("coop_sid");
  try {
    const session = await Session.findOne({
      where: {
        sid: coopSID,
      },
    });

    if (!session) {
    }
    const coopId = session?.dataValues?.data?.cooperativeId;

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
