import type { Share } from "$lib/definitions/types";
import { SharesTransactionTypes } from "$lib/internal/transaction";
import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ fetch }) => {
  const fetchSharesresponse = await fetch(
    `/api/shares?type=${SharesTransactionTypes.Withdraw}`
  );
  const { data: sharesData } = await fetchSharesresponse.json();
  const fetchTotalSharesReponse = await fetch(
    `/api/shares/total?type=${SharesTransactionTypes.Withdraw}`
  );
  const { data: totalData } = await fetchTotalSharesReponse.json();
  return {
    shares: (sharesData?.shares as Share[]) ?? [],
    total: totalData?.shares?.total ?? 0,
  };
};
