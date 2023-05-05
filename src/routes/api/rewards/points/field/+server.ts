import {
  EditCriteriaFieldPointValidation,
  EditDefaultCriteriaPointValidation,
} from "$lib/definitions/schema";
import { CriteriaFieldPoint } from "$lib/models/model";
import { json, type RequestHandler } from "@sveltejs/kit";
import { StatusCodes } from "http-status-codes";

export const POST: RequestHandler = async ({ request }) => {
  try {
    const body = await request.json();
    const parsedBody = await EditCriteriaFieldPointValidation.validate(body);
    const criteriaFieldModel = await CriteriaFieldPoint.findOne({
      where: {
        categoryId: parsedBody.categoryId,
        cooperativeId: parsedBody.cooperativeId,
        criteriaFieldId: parsedBody.criteriaFieldId,
      },
    });
    if (!criteriaFieldModel) {
      await CriteriaFieldPoint.create(parsedBody);
      return json({ message: "Points has been assigned." });
    }
    await criteriaFieldModel.update(parsedBody);
    return json({ message: "Points has been assigned." });
  } catch (error) {
    console.log(error);
    return json(
      { message: "Unknown error occured." },
      { status: StatusCodes.INTERNAL_SERVER_ERROR }
    );
  }
};
