import type { Loan } from "$lib/definitions/types";
import { LoanStatuses } from "$lib/internal/transaction";
import type { PageLoad } from "../$types";

export const load: PageLoad = async ({ fetch }) => {
  const finishedLoansResponse = await fetch(
    `/api/loans?status=${LoanStatuses.Finished}`
  );
  const { data: finishedLoansData } = await finishedLoansResponse.json();
  const totalFinishedLoansResponse = await fetch(
    `/api/loans/total?status=${LoanStatuses.Finished}`
  );

  const { data: totalRequestedLoansData } =
    await totalFinishedLoansResponse.json();

  return {
    loans: (finishedLoansData?.loans as Loan[]) ?? [],
    total: (totalRequestedLoansData.loans.total as {
      principal: number;
      interest: number;
    }) ?? { interest: 0, principal: 0 },
  };
};
