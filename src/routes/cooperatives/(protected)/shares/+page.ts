import type { Share } from "$lib/definitions/types";
import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ fetch }) => {
  const fetchSharesresponse = await fetch("/api/shares");
  const { data: sharesData } = await fetchSharesresponse.json();
  const fetchTotalSharesReponse = await fetch("/api/shares/total");
  const { data: totalData } = await fetchTotalSharesReponse.json();
  return {
    shares: (sharesData?.shares as Share[]) ?? [],
    total: totalData?.shares?.total ?? 0,
  };
};
