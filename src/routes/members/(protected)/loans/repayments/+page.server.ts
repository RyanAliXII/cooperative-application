import type { LoanRepayment as LoanRepaymentType } from "$lib/definitions/types";
import { Loan, LoanRepayment } from "$lib/models/model";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals }) => {
  const { session } = locals.session;
  const memberId = session.data?.member?.id;

  const repaymentModel = await LoanRepayment.findAll({
    include: [{ required: true, model: Loan, where: { memberId } }],
  });
  return {
    repayments: (repaymentModel.map((repayment) =>
      repayment.get({ plain: true })
    ) ?? []) as LoanRepaymentType[],
  };
};
