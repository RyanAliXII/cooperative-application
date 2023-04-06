import { Cooperative } from "$lib/models/model";

/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
  const cooperativeId = params?.cooperativeId;

  try {
    const coop = await Cooperative.findOne({
      where: {
        id: cooperativeId,
      },
    });
    return {
      cooperative: coop?.dataValues,
    };
  } catch (error) {
    console.log(error);
    return {};
  }
}
