import { StatusCodes } from "http-status-codes";
import { error, redirect } from "@sveltejs/kit";
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

export async function load({ cookies, params, locals }) {
  const id = params?.memberId;
  const { session } = locals.session;
  const coopId = session.data?.cooperative?.id;
  const member = await Member.findOne({
    where: {
      id: id,
      cooperativeId: coopId,
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
      cooperativeId: coopId,
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
              cooperativeId: coopId,
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
      cooperativeId: coopId,
    },
  });
  const savingsModel = await Saving.findAll({
    order: [["created_at", "desc"]],
    where: {
      memberId: id,
      cooperativeId: coopId,
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
}
