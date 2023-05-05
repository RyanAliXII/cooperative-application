import { EditDefaultCriteriaPointValidation } from "$lib/definitions/schema";
import { DefaultCriteriaPoint } from "$lib/models/model";
import { json, type RequestHandler } from "@sveltejs/kit";
import { StatusCodes } from "http-status-codes";

export const POST: RequestHandler = async ({ request }) => {
  try {
    const body = await request.json();
    const parsedBody = await EditDefaultCriteriaPointValidation.validate(body);
    const defaultCriteriaModel = await DefaultCriteriaPoint.findOne({
      where: {
        categoryId: parsedBody.categoryId,
        cooperativeId: parsedBody.cooperativeId,
      },
    });

    if (!defaultCriteriaModel) {
      await DefaultCriteriaPoint.create(parsedBody);
      return json({ message: "Points has been assigned." });
    }
    await defaultCriteriaModel.update(parsedBody);
    return json({ message: "Points has been assigned." });
  } catch (error) {
    console.log(error);
    return json(
      { message: "Unknown error occured." },
      { status: StatusCodes.INTERNAL_SERVER_ERROR }
    );
  }
};
