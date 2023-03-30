import { Cooperative } from "$lib/models/model";

/** @type {import('./$types').PageServerLoad} */
export async function load() {
  try {
    const coops = await Cooperative.findAll();
    return {
      coops: coops.map((c) => c.dataValues) ?? [],
    };
  } catch (error) {
    console.error(error);
    return {
      coops: [],
    };
  }
}
