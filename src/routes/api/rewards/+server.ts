import { CreateRewardValidation } from "$lib/definitions/schema";
import { Reward } from "$lib/models/model";
import { json, type RequestHandler } from "@sveltejs/kit";
import { StatusCodes } from "http-status-codes";

export const POST: RequestHandler = async ({ request }) => {
  try {
    const body = await request.json();
    const parsedBody = await CreateRewardValidation.validate(body);
    await Reward.create(parsedBody);
    return json({ message: "Reward created successfully." });
  } catch (error) {
    console.log(error);
    return json(
      { message: "Unknown error occured." },
      { status: StatusCodes.INTERNAL_SERVER_ERROR }
    );
  }
};
export const GET: RequestHandler = async () => {
  try {
    const rewards = await Reward.findAll({ order: [["created_at", "desc"]] });
    return json({
      message: "Rewards fetched successfully.",
      data: {
        rewards: rewards.map((reward) => reward.get({ plain: true })) ?? [],
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
