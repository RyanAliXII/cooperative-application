import type {
  CooperativeStats,
  LiquidityLog,
  SavingLog,
  ShareLog,
} from "$lib/definitions/types";
import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ fetch }) => {
  const response = await fetch("/api/shares/logs");
  const { data } = await response.json();
  const fetchSavingLogsResponse = await fetch("/api/savings/logs");
  const { data: savingLogsData } = await fetchSavingLogsResponse.json();
  const fetchStatsReponse = await fetch("/api/stats");
  const { data: statData } = await fetchStatsReponse.json();
  const fetchLiquidityLogsResponse = await fetch("/api/stats/logs");
  const { data: liquidityLogsData } = await fetchLiquidityLogsResponse.json();
  return {
    shares: {
      logs: (data?.logs ?? []) as ShareLog[],
    },
    savings: {
      logs: (savingLogsData?.logs ?? []) as SavingLog[],
    },
    liquidity: {
      logs: (liquidityLogsData?.liquidity?.logs ?? []) as LiquidityLog[],
    },
    stat: statData.stat as CooperativeStats,
  };
};
