import { Cooperative } from "$lib/models/model";

/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
  const cooperativeId = params?.cooperativeId;

  const coop = await Cooperative.findOne({
    where: {
      id: cooperativeId,
    },
  });

  return {
    cooperative: coop?.dataValues,
  };
}
