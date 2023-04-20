import type { Saving } from "$lib/definitions/types";
import { SavingsTransactionTypes } from "$lib/internal/transaction";
import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ fetch }) => {
  const fetchSavingsResponse = await fetch(
    `/api/savings?type=${SavingsTransactionTypes.Deposit}`
  );

  const { data: savingsData } = await fetchSavingsResponse.json();
  const fetchTotalSavingsResponse = await fetch(
    `/api/savings/total?type=${SavingsTransactionTypes.Deposit}`
  );
  const { data: totalData } = await fetchTotalSavingsResponse.json();
  return {
    shares: (savingsData?.savings as Saving[]) ?? [],
    total: totalData?.savings?.total ?? 0,
  };
};
