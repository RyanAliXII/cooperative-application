import { error } from "@sveltejs/kit";
import {
  Loan,
  LoanRepayment,
  Member,
  MemberAccount,
  MemberStat,
  Saving,
  Share,
} from "$lib/models/model";
import type {
  LoanRepayment as LoanRepaymentType,
  MemberStats,
  Member as MemberType,
  Share as ShareType,
  Saving as SavingType,
} from "$lib/definitions/types.js";
import type { PageServerLoad } from "./$types";
export const load: PageServerLoad = async ({ cookies, params, locals }) => {
  const { session } = locals.session;
  const id = session.data.member?.id;
  const member = await Member.findOne({
    where: {
      id: id,
    },

    include: [
      {
        model: MemberAccount,
        attributes: {
          exclude: ["password"],
        },
        as: "account",
      },
    ],
  });
  const memberStatModel = await MemberStat.findOne({
    where: {
      memberId: id,
    },
  });
  const repaymentModel = await LoanRepayment.findAll({
    order: [["created_at", "desc"]],
    include: [
      {
        required: true,
        model: Loan,
        include: [
          {
            required: true,
            model: Member,
            where: {
              id: id,
            },
          },
        ],
      },
    ],
  });

  const sharesModel = await Share.findAll({
    order: [["created_at", "desc"]],
    where: {
      memberId: id,
    },
  });
  const savingsModel = await Saving.findAll({
    order: [["created_at", "desc"]],
    where: {
      memberId: id,
    },
  });

  if (!member || !memberStatModel || !repaymentModel || !sharesModel) {
    throw error(404, "Record not found.");
  }

  return {
    member: member.get({ plain: true }) as MemberType,
    stat: memberStatModel.get({ plain: true }) as MemberStats,
    repayments: (repaymentModel.map((loanRepayment) =>
      loanRepayment.get({ plain: true })
    ) ?? []) as LoanRepaymentType[],
    memberId: id,
    sharesTransactions: (sharesModel.map((sharesTransaction) =>
      sharesTransaction.get({ plain: true })
    ) ?? []) as ShareType[],
    savingsTransactions: (savingsModel.map((savingsTransaction) =>
      savingsTransaction.get({ plain: true })
    ) ?? []) as SavingType[],
  };
};
