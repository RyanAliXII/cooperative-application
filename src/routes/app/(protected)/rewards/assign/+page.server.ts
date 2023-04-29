import {
  Cooperative,
  CooperativeCategory,
  CooperativeStat,
} from "$lib/models/model";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ fetch }) => {
  // const fetchSelectedCooperatives = await fetch("/api/rewards/cooperatives");
  // const { data } = await fetchSelectedCooperatives.json();
  // const fetchRewards = await fetch("/api/rewards");
  // const { data: rewardsData } = await fetchRewards.json();
  // return {
  //   cooperatives: data?.cooperatives as Cooperative[],
  //   rewards: (rewardsData?.rewards as Reward[]) ?? [],
  // };

  try {
    const categories = await CooperativeCategory.findAll({
      include: [
        {
          model: Cooperative,
          as: "cooperatives",
          include: [
            {
              model: CooperativeStat,
              as: "stats",
            },
          ],
        },
      ],
    });
    console.log(categories.map((c) => c.get({ plain: true })));
  } catch (er) {
    {
      console.log(er);
    }
  }

  return {};
};
