import { json } from "@sveltejs/kit";
import type { RequestHandler } from "../$types";
import { ShareLog } from "$lib/models/model";
import { StatusCodes } from "http-status-codes";
import { ShareLogModel } from "$lib/models/share_log";

export const GET: RequestHandler = async ({ locals }) => {
  const { session } = locals.session;
  const coopId = session.data?.cooperative?.id;
  try {
    const shareLogModel = await ShareLog.findAll({
      where: {
        cooperativeId: coopId,
      },
    });
    if (!shareLogModel) {
      return json(
        {
          message: "Invalid cooperative id",
        },
        { status: StatusCodes.BAD_REQUEST }
      );
    }
    const logs = await shareLogModel.map((l) => l.get({ plain: true }));
    return json({ message: "Share logs fetched.", data: { logs: logs ?? [] } });
  } catch (error) {
    console.log(error);
    return json(
      { message: "Unknown error occured." },
      { status: StatusCodes.INTERNAL_SERVER_ERROR }
    );
  }
};
