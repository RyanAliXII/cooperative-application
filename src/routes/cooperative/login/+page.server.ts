/** @type {import('./$types').Actions} */
import { redirect } from "@sveltejs/kit";
import { CooperativeAccount } from "$lib/models/model";
import { compare } from "bcrypt";

export const actions = {
  login: async ({ request, cookies }) => {
    const form = await request.formData();
    const email = form.get("email") as string;
    const password = form.get("password") as string;
    if (!email || !password) {
      return { message: "Invalid username or password." };
    }
    const account = await CooperativeAccount.findOne({
      where: {
        email: email,
      },
    });

    if (!account) {
      throw redirect(303, "/login");
    }
    const isPasswordSame = await compare(password, account.dataValues.password);
    if (!isPasswordSame) {
      return { message: "Invalid username or password." };
    }
    const sid = crypto.randomUUID();
    cookies.set("coop_sid", sid, {
      path: "/cooperative",
      httpOnly: true,
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 30, //one month
    });
    throw redirect(303, "/cooperative/dashboard");
  },
};
