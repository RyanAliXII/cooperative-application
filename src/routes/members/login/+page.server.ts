import { Member, MemberAccount, Session } from "$lib/models/model";
import { compare } from "bcrypt";
import { redirect } from "@sveltejs/kit";
import { StatusCodes } from "http-status-codes";
import type { MemberAccount as MemberAccountType } from "$lib/definitions/types.js";

export const actions = {
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
        expiresAt: expiration.toISOString(),
      });

      cookies.set("app_sid", session.dataValues.sid, {
        path: "/",
        httpOnly: true,
        sameSite: "strict",
        maxAge: 3600 * 24, //one day
      });
    } catch (error) {
      return { message: "Logged In" };
    }

    throw redirect(StatusCodes.SEE_OTHER, "/members/dashboard");
  },
};
