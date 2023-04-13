import type { Loan } from "$lib/definitions/types";
import { LoanStatuses } from "$lib/internal/transaction";
import type { PageLoad } from "../$types";

export const load: PageLoad = async ({ fetch }) => {
  const requestedLoansResponse = await fetch(
    `/api/loans?status=${LoanStatuses.Approved}`
  );
  const { data: requestedLoansData } = await requestedLoansResponse.json();
  const totalRequestedLoansResponse = await fetch(
    `/api/loans/total?status=${LoanStatuses.Approved}`
  );

  const { data: totalRequestedLoansData } =
    await totalRequestedLoansResponse.json();

  return {
    loans: (requestedLoansData?.loans as Loan[]) ?? [],
    total: (totalRequestedLoansData.loans.total as {
      principal: number;
      interest: number;
    }) ?? { interest: 0, principal: 0 },
  };
};
