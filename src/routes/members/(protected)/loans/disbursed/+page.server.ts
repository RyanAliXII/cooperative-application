import type { Loan as LoanType } from "$lib/definitions/types";
import { LoanStatuses } from "$lib/internal/transaction";
import { Loan } from "$lib/models/model";
import type { PageServerLoad } from "./$types";
export const load: PageServerLoad = async ({ locals }) => {
  const { session } = locals.session;
  const memberId = session.data?.member.id;
  const loanModel = await Loan.findAll({
    where: { memberId, status: LoanStatuses.Disbursed },
  });

  return {
    loans: (loanModel.map((loan) => loan.get({ plain: true })) ??
      []) as LoanType[],
  };
};
