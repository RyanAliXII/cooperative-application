/** @type {import('./$types').Actions} */
import { redirect } from "@sveltejs/kit";
import { Account, Session } from "$lib/models/model";
import { compare } from "bcrypt";

export const actions = {
  login: async ({ request, cookies }) => {
    const form = await request.formData();
    const email = form.get("email") as string;
    const password = form.get("password") as string;
    if (!email || !password) {
      return { message: "Invalid username or password." };
    }
    const account = await Account.findOne({
      where: {
        email: email,
      },
    });

    if (!account) {
      return { message: "Invalid username or password." };
    }
    const isPasswordSame = await compare(password, account.dataValues.password);
    if (!isPasswordSame) {
      return { message: "Invalid username or password." };
    }
    const expiration = new Date();
    expiration.setDate(expiration.getDate() + 1); // add 1 day expiration
    const session = await Session.create({
      data: account.dataValues,
      expiresAt: expiration.toISOString(),
    });
    cookies.set("app_sid", session.dataValues.sid, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      maxAge: 3600 * 24, //one day
    });
    throw redirect(303, "/app/dashboard");
  },
};
