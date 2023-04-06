import { MemberAccount } from "$lib/models/model";
import { compare } from "bcrypt";
import { redirect } from "@sveltejs/kit";
import { StatusCodes } from "http-status-codes";
import { STATUS_CODES } from "http";
export const actions = {
  login: async ({ request, cookies }) => {
    const formData = await request.formData();
    const email = formData.get("email");
    const password = formData.get("password");
    password;
    try {
      const account = await MemberAccount.findOne({
        where: {
          email: email,
        },
      });
      if (!account) {
        return {
          message: "Invalid email or password.",
          error: true,
          info: false,
        };
      }
      if (account?.dataValues?.rejectedAt) {
        return {
          message:
            "Your account has been unapproved. Please contact the cooperative.",
          error: true,
          info: false,
        };
      }
      const isPasswordSame = await compare(
        password?.toString() ?? "",
        account?.dataValues?.password
      );
      if (!isPasswordSame) {
        return {
          message: "Invalid email or password.",
          error: true,
          info: false,
        };
      }

      if (!account?.dataValues?.approvedAt) {
        return {
          message: "Your account  is still waiting for approval.",
          error: false,
          info: true,
        };
      }
    } catch (error) {
      return { message: "Logged In" };
    }

    throw redirect(StatusCodes.SEE_OTHER, "/members/dashboard");
  },
};
