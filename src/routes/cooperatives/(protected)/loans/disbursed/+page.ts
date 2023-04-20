import type { Loan } from "$lib/definitions/types";
import { LoanStatuses } from "$lib/internal/transaction";
import type { PageLoad } from "../$types";

export const load: PageLoad = async ({ fetch }) => {
  const disbursedLoansResponse = await fetch(
    `/api/loans?status=${LoanStatuses.Disbursed}`
  );
  const { data: disbursedLoansData } = await disbursedLoansResponse.json();
  const totalDisbursedLoansResponse = await fetch(
    `/api/loans/total?status=${LoanStatuses.Disbursed}`
  );

  const { data: totalDisbursedLoansData } =
    await totalDisbursedLoansResponse.json();

  return {
    loans: (disbursedLoansData?.loans as Loan[]) ?? [],
    total: (totalDisbursedLoansData.loans.total as {
      principal: number;
      interest: number;
    }) ?? { interest: 0, principal: 0 },
  };
};
