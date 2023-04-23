import { SelectedCooperative } from "$lib/models/model";
import type { RequestHandler } from "@sveltejs/kit";
import { json } from "@sveltejs/kit";
import { StatusCodes } from "http-status-codes";

export const DELETE: RequestHandler = async ({ params }) => {
  try {
    const coopId = params?.cooperativeId;
    await SelectedCooperative.destroy({ where: { cooperativeId: coopId } });
    return json({ message: "Selected coop has been deleted." });
  } catch (error) {
    console.log(error);
    return json(
      { message: "Unknown error occured." },
      { status: StatusCodes.INTERNAL_SERVER_ERROR }
    );
  }
};
