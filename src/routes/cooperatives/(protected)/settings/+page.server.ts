import { Cooperative, CooperativeAccount } from "$lib/models/model";
export async function load({ cookies, locals }) {
  const { session } = locals.session;
  const cooperativeModel = await Cooperative.findOne({
    where: {
      id: session.data?.cooperative.id,
    },
    include: [
      {
        model: CooperativeAccount,
        attributes: {
          exclude: ["password"],
        },
        where: {
          isOwner: true,
        },
        limit: 1,
        as: "accounts",
      },
    ],
  });
  const cooperative = cooperativeModel?.get({ plain: true });
  cooperative.account = cooperative.accounts[0];
  delete cooperative.accounts;
  return {
    cooperative: cooperative,
  };
}
