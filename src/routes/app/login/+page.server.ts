/** @type {import('./$types').Actions} */
import { redirect, type Actions } from "@sveltejs/kit";
import { Account, Session } from "$lib/models/model";
import { compare } from "bcrypt";
import { AppTypes } from "$lib/internal/session.js";

export const actions: Actions = {
  login: async ({ request, cookies }) => {
    const form = await request.formData();
    const email = form.get("email") as string;
    const password = form.get("password") as string;
    if (!email || !password) {
      return { message: "Invalid username or password." };
    }
    const account = (
      await Account.findOne({
        where: {
          email: email,
        },
      })
    )?.get({ plain: true });

    if (!account) {
      return { message: "Invalid username or password." };
    }
    const isPasswordSame = await compare(password, account.password);
    if (!isPasswordSame) {
      return { message: "Invalid username or password." };
    }
    const expiration = new Date();
    expiration.setDate(expiration.getDate() + 1); // add 1 day expiration
    const session = await Session.create({
      appType: AppTypes.Main,
      data: account,
      expiresAt: expiration.toISOString(),
    });
    delete account.password;
    cookies.set("app_sid", session.dataValues.sid, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      maxAge: 3600 * 24, //one day
    });
    throw redirect(303, "/app/dashboard");
  },
};
