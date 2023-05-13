import type { CooperativeAccount as CooperativeAccountType } from "$lib/definitions/types.js";
import { Cooperative, CooperativeAccount } from "$lib/models/model";
import type { Actions } from "@sveltejs/kit";
import { compare, hash } from "bcrypt";
import type { PageServerLoad } from "./$types";
export const load: PageServerLoad = async ({ locals }) => {
  const { session } = locals.session;
  const cooperativeModel = await Cooperative.findOne({
    where: {
      id: session.data?.cooperative.id,
    },
    include: [
      {
        model: CooperativeAccount,
        attributes: {
          exclude: ["password"],
        },
        where: {
          isOwner: true,
        },
        limit: 1,
        as: "accounts",
      },
    ],
  });
  const cooperative = cooperativeModel?.get({ plain: true });
  cooperative.account = cooperative.accounts[0];
  delete cooperative.accounts;
  return {
    cooperative: cooperative,
    session: session,
  };
};

export const actions: Actions = {
  changePassword: async ({ locals, request }) => {
    const { session } = locals.session;
    const accountId = session.data.id;
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
      const accountModel = await CooperativeAccount.findOne({
        where: { id: accountId },
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
      }) as CooperativeAccountType;
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
