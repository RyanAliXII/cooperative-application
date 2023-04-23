import type { Reward } from "$lib/definitions/types";
import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ fetch }) => {
  const fetchRewards = await fetch("/api/rewards");
  const { data } = await fetchRewards.json();
  return {
    rewards: (data.rewards ?? []) as Reward[],
  };
};
