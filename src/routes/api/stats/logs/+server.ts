import { LiquidityLog } from "$lib/models/model";
import { json, type RequestHandler } from "@sveltejs/kit";
import { StatusCodes } from "http-status-codes";

export const GET: RequestHandler = async ({ locals }) => {
  const { session } = locals.session;
  const coopId = session.data?.cooperative?.id;
  try {
    const liquidityLogModel = await LiquidityLog.findAll({
      where: { cooperativeId: coopId },
    });

    if (!liquidityLogModel) {
      return json({ message: "Not found" }, { status: StatusCodes.NOT_FOUND });
    }
    return json({
      message: "Cooperative stat logs have been fetched.",
      data: {
        liquidity: {
          logs: liquidityLogModel?.map((l) => l.get({ plain: true })) ?? [],
        },
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
