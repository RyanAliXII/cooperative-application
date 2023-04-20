import type { LoanRepayment } from "$lib/definitions/types";
import type { PageLoad } from "../$types";

export const load: PageLoad = async ({ fetch }) => {
  const response = await fetch("/api/repayments");
  const { data } = await response.json();
  return {
    repayments: (data?.repayments ?? []) as LoanRepayment[],
  };
};
