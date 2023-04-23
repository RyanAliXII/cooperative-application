import { GiveRewardValidation } from "$lib/definitions/schema";
import { Cooperative, Recognition, Reward } from "$lib/models/model";
import { json, type RequestHandler } from "@sveltejs/kit";
import { StatusCodes } from "http-status-codes";

export const POST: RequestHandler = async ({ request }) => {
  try {
    const body = await request.json();
    const parsedBody = await GiveRewardValidation.validate(body);
    await Recognition.create(parsedBody);
    return json({ message: "Recognition created successfully." });
  } catch (error) {
    console.log(error);
    return json(
      { message: "unknown error occurred" },
      { status: StatusCodes.INTERNAL_SERVER_ERROR }
    );
  }
};
export const GET: RequestHandler = async ({ request }) => {
  try {
    const recognitionModel = await Recognition.findAll({
      order: [["created_at", "desc"]],
      include: [
        {
          model: Reward,
        },
        {
          model: Cooperative,
        },
      ],
    });

    return json({
      message: "Recognitions has been fetched.",
      data: {
        recognitions: recognitionModel.map((r) => r.get({ plain: true })) ?? [],
      },
    });
  } catch (error) {
    console.log(error);
    return json(
      { message: "unknown error occurred", data: { recognitions: [] } },
      { status: StatusCodes.INTERNAL_SERVER_ERROR }
    );
  }
};
