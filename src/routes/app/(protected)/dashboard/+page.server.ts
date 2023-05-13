import {
  Cooperative,
  CooperativeCategory,
  Member,
  Recognition,
} from "$lib/models/model";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {
  const numberOfCooperatives = await Cooperative.count();
  const numberOfMembers = await Member.count();
  const numberOfRecognitions = await Recognition.count();
  const numberOfCategories = await CooperativeCategory.count();
  return {
    cooperatives: {
      count: numberOfCooperatives,
    },
    members: {
      count: numberOfMembers,
    },
    recognitions: {
      count: numberOfRecognitions,
    },
    categories: {
      count: numberOfCategories,
    },
  };
};
