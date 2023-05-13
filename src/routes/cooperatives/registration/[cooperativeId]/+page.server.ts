import { Cooperative } from "$lib/models/model";
import { error } from "@sveltejs/kit";
import { StatusCodes } from "http-status-codes";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params }) => {
  const cooperativeId = params?.cooperativeId;

  const coop = await Cooperative.findOne({
    where: {
      id: cooperativeId,
    },
  });

  if (!coop) {
    throw error(
      StatusCodes.NOT_FOUND,
      "The page your are looking for cannot be found."
    );
  }
  return {
    cooperative: coop?.dataValues,
  };
};
