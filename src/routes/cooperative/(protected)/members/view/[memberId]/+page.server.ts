import { StatusCodes } from "http-status-codes";
import { redirect } from "@sveltejs/kit";
import { Member, Session } from "$lib/models/model";
/** @type {import('./$types').PageServerLoad} */
export async function load({ cookies, params }) {
  const id = params?.memberId;

  const member = await Member.findOne({
    where: {
      id: id,
    },
  });

  return {
    member: member?.dataValues,
    memberId: id,
  };
}
