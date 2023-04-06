import { StatusCodes } from "http-status-codes";
import { json, redirect } from "@sveltejs/kit";
import { Member, MemberAccount, Session } from "$lib/models/model";
import type { MemberAccount as MemberAccountType } from "$lib/definitions/types";
/** @type {import('./$types').PageServerLoad} */
export async function load({ cookies, params }) {
  const coopSID = cookies.get("coop_sid");
  try {
    const session = await Session.findOne({
      where: {
        sid: coopSID,
      },
    });

    if (!session) {
    }
    const coopId = session?.dataValues?.data?.cooperativeId;

    const accounts = await MemberAccount.findAll({
      attributes: {
        exclude: ["password"],
      },
      include: [
        {
          required: true,
          where: {
            cooperativeId: coopId,
          },
          model: Member,
        },
      ],
      where: {
        approvedAt: null,
      },
    });

    return {
      accounts:
        accounts.map((a) => {
          a.dataValues.member = a.dataValues?.member?.dataValues;
          return a.dataValues as MemberAccountType;
        }) ?? [],
    };
  } catch (error) {
    console.log(error);
    return {
      accounts: [],
    };
  }
}
