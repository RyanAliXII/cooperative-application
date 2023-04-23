import { CooperativeStat } from "$lib/models/model";
import { json, type RequestHandler } from "@sveltejs/kit";
import { StatusCodes } from "http-status-codes";

export const GET: RequestHandler = async ({ locals, params }) => {
  const coopId = params?.cooperativeId;
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
        stats: statModel.get({ plain: true }),
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
