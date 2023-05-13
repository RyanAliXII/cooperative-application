import { error, type Actions } from "@sveltejs/kit";
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
  MemberAccount as MemberAccountType,
} from "$lib/definitions/types.js";
import type { PageServerLoad } from "./$types";
import { compare, hash } from "bcrypt";
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

export const actions: Actions = {
  changePassword: async ({ locals, request }) => {
    const { session } = locals.session;
    const memberId = session.data.memberId;
    const formData = await request.formData();
    const newPassword = formData.get("newPassword") as string;
    const confirmPassword = formData.get("confirmPassword") as string;
    const oldPassword = formData.get("oldPassword") as string;
    try {
      if (newPassword != confirmPassword) {
        return {
          error: true,
          success: false,
          message:
            "New password doesn't match with password confirmation field.",
        };
      }
      const accountModel = await MemberAccount.findOne({
        where: { memberId },
      });
      if (!accountModel) {
        return {
          error: true,
          success: false,
          message: "Request cannot be fulfilled right now.",
        };
      }
      const account = accountModel.get({
        plain: true,
      }) as MemberAccountType;
      const isOldPasswordSame = await compare(
        oldPassword,
        account.password ?? ""
      );
      if (!isOldPasswordSame) {
        return {
          error: true,
          success: false,
          message: "Old password is incorrect.",
        };
      }
      const newHashedPassword = await hash(newPassword, 5);
      await accountModel.update({
        password: newHashedPassword,
      });
      return {
        error: false,
        success: true,
        message: "Password has been changed.",
      };
    } catch {
      return {
        error: true,
        success: false,
        message: "Request cannot be fulfilled right now.",
      };
    }
  },
};
