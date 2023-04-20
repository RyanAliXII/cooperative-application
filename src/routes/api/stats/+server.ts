import type { CooperativeStats } from "$lib/definitions/types";
import { CooperativeStat } from "$lib/models/model";
import { sequelize } from "$lib/models/sequelize";
import { json, type RequestHandler } from "@sveltejs/kit";
import { StatusCodes } from "http-status-codes";
import { QueryTypes } from "sequelize";

export const GET: RequestHandler = async ({ locals }) => {
  const { session } = locals.session;
  const coopId = session.data?.cooperative?.id;
  try {
    const statModel = await CooperativeStat.findOne({
      where: { cooperativeId: coopId },
    });

    if (!statModel) {
      return json({ message: "Not found" }, { status: StatusCodes.NOT_FOUND });
    }
    return json({
      message: "Cooperative stats have been fetched.",
      data: {
        stat: statModel.get({ plain: true }),
      },
    });
  } catch (error) {
    console.log(error);
    return json(
      { message: "Unknown error occured." },
      { status: StatusCodes.INTERNAL_SERVER_ERROR }
    );
  }
};
