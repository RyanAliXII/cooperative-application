import { StatusCodes } from "http-status-codes";
import { error, redirect } from "@sveltejs/kit";
import {
  Cooperative,
  CooperativeAccount,
  Member,
  Session,
} from "$lib/models/model";
/** @type {import('./$types').PageServerLoad} */
export async function load({ cookies }) {
  const sid = cookies.get("coop_sid");
  if (!sid) {
    throw redirect(StatusCodes.SEE_OTHER, "/cooperative/login");
  }
  const session = await Session.findOne({
    where: {
      sid: sid,
    },
  });
  const coopId = session?.dataValues?.data?.cooperative?.id;

  try {
    const cooperative = await Cooperative.findOne({
      where: {
        id: coopId,
      },
      include: [
        {
          model: CooperativeAccount,
          where: {
            isOwner: true,
          },
          as: "accounts",
        },
      ],
    });

    if (!cooperative?.dataValues?.accounts) {
      throw error(StatusCodes.NOT_FOUND, { message: "Not found" });
    }
    const accounts = cooperative?.dataValues.accounts?.map(
      (a: any) => a?.dataValues
    );

    delete cooperative?.dataValues?.accounts;
    return {
      cooperative: {
        ...cooperative?.dataValues,
        account: accounts[0],
      },
    };
  } catch (err) {
    console.log(err);
    throw error(StatusCodes.INTERNAL_SERVER_ERROR, {
      message: "Unknown error occured.",
    });
  }
}
