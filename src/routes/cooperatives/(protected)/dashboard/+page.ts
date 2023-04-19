import type { CooperativeStats, ShareLog } from "$lib/definitions/types";
import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ fetch }) => {
  const response = await fetch("/api/shares/logs");
  const { data } = await response.json();
  const fetchStatsReponse = await fetch("/api/stats");
  const { data: statData } = await fetchStatsReponse.json();
  console.log(statData);
  return {
    shares: {
      logs: (data?.logs ?? []) as ShareLog[],
    },
    stat: statData.stat as CooperativeStats,
  };
};
