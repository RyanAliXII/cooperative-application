import type { Cooperative as CooperativeType } from "$lib/definitions/types";
import { Cooperative } from "$lib/models/model";

/** @type {import('./$types').PageServerLoad} */
export async function load() {
  try {
    const coops = await Cooperative.findAll();
    return {
      coops: (coops.map((c) => c.dataValues) ?? []) as CooperativeType[],
    };
  } catch (error) {
    console.error(error);
    return {
      coops: [],
    };
  }
}
