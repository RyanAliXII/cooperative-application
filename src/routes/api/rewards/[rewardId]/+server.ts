import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { StatusCodes } from "http-status-codes";
import { Reward } from "$lib/models/model";
import { EditRewardValidation } from "$lib/definitions/schema";

export const PUT: RequestHandler = async ({ params, request }) => {
  const rewardId = params?.rewardId;
  try {
    const body = await request.json();
    const parsedBody = await EditRewardValidation.validate(body);
    await Reward.update(parsedBody, { where: { id: rewardId } });
    return json({ message: "Reward has been updated." });
  } catch (error) {
    console.log(error);
    return json(
      { message: "Unknown error occured." },
      { status: StatusCodes.INTERNAL_SERVER_ERROR }
    );
  }
};
