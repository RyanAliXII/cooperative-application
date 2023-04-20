import { StatusCodes } from "http-status-codes";
import { error, redirect } from "@sveltejs/kit";
import { Member, MemberAccount, Session } from "$lib/models/model";
/** @type {import('./$types').PageServerLoad} */
export async function load({ cookies, params }) {
  const id = params?.memberId;

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

  if (!member) {
    throw error(404, "Record not found.");
  }
  return {
    member: member?.get({ plain: true }),
    memberId: id,
  };
}
