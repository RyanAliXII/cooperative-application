import { Session } from "$lib/models/model.js";

export async function load({ cookies }) {
  const coopSID = cookies.get("coop_sid");
  const sessionModel = await Session.findOne({
    where: {
      sid: coopSID,
    },
  });
  const session = sessionModel?.get({ plain: true });

  return {
    cooperative: session?.data?.cooperative ?? { id: "", name: "" },
  };
}
