import { Cooperative, CooperativeAccount } from "$lib/models/model";
import { error } from "@sveltejs/kit";
import { StatusCodes } from "http-status-codes";
import { validate } from "uuid";
/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
  const coopId = params.slug;
  const isIdValid = validate(coopId);
  if (!isIdValid) {
    throw error(StatusCodes.NOT_FOUND, { message: "Not Found" });
  }
  try {
    const coop = await Cooperative.findOne({
      where: {
        id: coopId,
      },
      include: [
        {
          required: true,
          model: CooperativeAccount,
          where: {
            isOwner: true,
          },
          as: "accounts",
        },
      ],
    });
    if (!coop) {
      throw error(StatusCodes.NOT_FOUND, { message: "Not Found" });
    }
    const accounts = coop?.dataValues?.accounts.map((a: any) => a?.dataValues);
    if (accounts.length === 0) {
      throw error(StatusCodes.NOT_FOUND, { message: "Not Found" });
    }
    delete coop?.dataValues?.accounts;
    return {
      cooperative: {
        ...coop?.dataValues,
        account: accounts[0],
      },

      cooperativeId: coopId,
    };
  } catch (err) {
    console.log(err);
    throw error(StatusCodes.INTERNAL_SERVER_ERROR, {
      message: "Unknown error occured.",
    });
  }
}
