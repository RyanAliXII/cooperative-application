import type { Saving, Share } from "$lib/definitions/types";
import {
  SavingsTransactionTypes,
  SharesTransactionTypes,
} from "$lib/internal/transaction";
import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ fetch }) => {
  const fetchSavingsWithdrawalResponse = await fetch(
    `/api/savings?type=${SavingsTransactionTypes.Withdraw}`
  );
  const { data: savingsData } = await fetchSavingsWithdrawalResponse.json();
  const fetchTotalSharesReponse = await fetch(
    `/api/savings/total?type=${SharesTransactionTypes.Withdraw}`
  );
  const { data: totalData } = await fetchTotalSharesReponse.json();

  return {
    withdrawals: (savingsData?.savings as Saving[]) ?? [],
    total: totalData?.savings?.total ?? 0,
  };
};
