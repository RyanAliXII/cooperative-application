import { StatusCodes } from "http-status-codes";
import { redirect } from "@sveltejs/kit";
import { Member, MemberAccount, Session } from "$lib/models/model";
/** @type {import('./$types').PageServerLoad} */
export async function load({ cookies, params }) {
  const id = params?.memberId;
  try {
    const member = await Member.findOne({
      where: {
        id: id,
      },
      include: [
        {
          model: MemberAccount,
          as: "account",
        },
      ],
    });
    return {
      member: member?.get({ plain: true }),
      memberId: id,
    };
  } catch (error) {
    console.log(error);
    return {};
  }
}
