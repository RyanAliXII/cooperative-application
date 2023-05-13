import { MemberAccount } from "$lib/models/model";
import { json, type RequestHandler } from "@sveltejs/kit";
import { Op } from "sequelize";

export const GET: RequestHandler = async ({ url }) => {
  const email = url.searchParams.get("email");
  const except = url.searchParams.get("except");
  if (!email) {
    return json({ exist: false });
  }
  let count = 0;
  if (email && except) {
    count = await MemberAccount.count({
      where: {
        email: {
          [Op.eq]: email,
          [Op.not]: except,
        },
      },
    });
  } else {
    count = await MemberAccount.count({ where: { email: email } });
  }

  if (count > 0) {
    return json({ exist: true });
  }
  return json({ exist: false });
};
