import type { Cooperative, Reward } from "$lib/definitions/types";

import type { PageLoad } from "../$types";

export const load: PageLoad = async ({ fetch }) => {
  const fetchSelectedCooperatives = await fetch("/api/rewards/cooperatives");
  const { data } = await fetchSelectedCooperatives.json();
  const fetchRewards = await fetch("/api/rewards");
  const { data: rewardsData } = await fetchRewards.json();

  return {
    cooperatives: data?.cooperatives as Cooperative[],
    rewards: (rewardsData?.rewards as Reward[]) ?? [],
  };
};
