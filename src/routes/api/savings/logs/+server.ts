import { json } from "@sveltejs/kit";
import type { RequestHandler } from "../$types";
import { StatusCodes } from "http-status-codes";
import { SavingLogModel } from "$lib/models/saving_log";

export const GET: RequestHandler = async ({ locals }) => {
  const { session } = locals.session;
  const coopId = session.data?.cooperative?.id;
  try {
    const savingLogModel = await SavingLogModel.findAll({
      where: {
        cooperativeId: coopId,
      },
    });
    if (!savingLogModel) {
      return json(
        {
          message: "Invalid cooperative id",
        },
        { status: StatusCodes.BAD_REQUEST }
      );
    }
    const logs = savingLogModel.map((l) => l.get({ plain: true }));
    return json({
      message: "Saving logs fetched.",
      data: { logs: logs ?? [] },
    });
  } catch (error) {
    console.log(error);
    return json(
      { message: "Unknown error occured." },
      { status: StatusCodes.INTERNAL_SERVER_ERROR }
    );
  }
};
