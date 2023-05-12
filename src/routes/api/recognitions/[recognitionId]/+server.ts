import { EditGivenRewardValidation } from "$lib/definitions/schema";
import { Recognition } from "$lib/models/model";
import { json, type RequestHandler } from "@sveltejs/kit";
import { StatusCodes } from "http-status-codes";

export const PUT: RequestHandler = async ({ params, request }) => {
  const id = params?.recognitionId;
  try {
    const body = await request.json();
    const parsedBody = await EditGivenRewardValidation.validate(body);

    await Recognition.update(
      {
        rewardId: parsedBody.rewardId,
        date: parsedBody.date,
      },
      {
        where: {
          id,
        },
      }
    );
    return json({ message: "Recognition has been updated." });
  } catch (error) {
    console.log(error);
    return json({}, { status: StatusCodes.INTERNAL_SERVER_ERROR });
  }
};

export const DELETE: RequestHandler = async ({ params }) => {
  const id = params?.recognitionId;
  try {
    await Recognition.destroy({
      where: {
        id,
      },
    });
    return json({ message: "Recognition has been deleted." });
  } catch (error) {
    console.log(error);
    return json({}, { status: StatusCodes.INTERNAL_SERVER_ERROR });
  }
};
