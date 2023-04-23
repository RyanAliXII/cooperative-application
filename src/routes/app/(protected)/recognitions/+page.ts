import type { Recognition, Reward } from "$lib/definitions/types";
import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ fetch }) => {
  const fetchRecognitions = await fetch("/api/recognitions");
  const { data } = await fetchRecognitions.json();
  const fetchRewards = await fetch("/api/rewards");
  const { data: rewardsData } = await fetchRewards.json();

  return {
    recognitions: (data?.recognitions ?? []) as Recognition[],
    rewards: (rewardsData?.rewards ?? []) as Reward[],
  };
};
