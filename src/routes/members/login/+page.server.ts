import { Cooperative, Member, MemberAccount, Session } from "$lib/models/model";
import { compare } from "bcrypt";
import { redirect, type Actions } from "@sveltejs/kit";
import { StatusCodes } from "http-status-codes";
import type { MemberAccount as MemberAccountType } from "$lib/definitions/types.js";
import { AppTypes } from "$lib/internal/session";

export const actions: Actions = {
  login: async ({ request, cookies }) => {
    const formData = await request.formData();
    const email = formData.get("email");
    const password = formData.get("password");
    password;
    try {
      const accountModel = await MemberAccount.findOne({
        where: {
          email: email,
        },
        include: [
          {
            model: Member,
            include: [
              {
                model: Cooperative,
              },
            ],
          },
        ],
      });

      if (!accountModel) {
        return {
          message: "Invalid email or password.",
          error: true,
          info: false,
        };
      }

      const account: MemberAccountType = accountModel.get({ plain: true });
      console.log(account);
      if (account?.member?.declinedAt) {
        return {
          message:
            "Your account has been rejected. Please contact the cooperative.",
          error: true,
          info: false,
        };
      }
      const isPasswordSame = await compare(
        password?.toString() ?? "",
        account?.password
      );
      if (!isPasswordSame) {
        return {
          message: "Invalid email or password.",
          error: true,
          info: false,
        };
      }

      if (!account?.member?.approvedAt) {
        return {
          message: "Your account  is still waiting for approval.",
          error: false,
          info: true,
        };
      }
      const expiration = new Date();
      expiration.setDate(expiration.getDate() + 1); // add 1 day expiration
      const session = await Session.create({
        data: account,
        appType: AppTypes.Member,
        expiresAt: expiration.toISOString(),
      });

      cookies.set("app_sid", session.dataValues.sid, {
        path: "/",
        httpOnly: true,
        sameSite: "strict",
        maxAge: 3600 * 24, //one day
      });
    } catch (error) {
      console.log(error);
      return {
        message: "Unknown error occured.",
        error: true,
        info: false,
      };
    }

    throw redirect(StatusCodes.SEE_OTHER, "/members/dashboard");
  },
};
