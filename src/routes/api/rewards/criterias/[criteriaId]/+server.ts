import { EditCriteriaValidation } from "$lib/definitions/schema";
import { CooperativeCriteria } from "$lib/models/model";
import { json, type RequestHandler } from "@sveltejs/kit";
import { StatusCodes } from "http-status-codes";

export const PUT: RequestHandler = async ({ request, params }) => {
  try {
    const id = params?.criteriaId ?? "";
    const body = await request.json();
    const parsedBody = await EditCriteriaValidation.validate(body);
    await CooperativeCriteria.update(parsedBody, {
      where: { id },
    });
    return json({ message: "Criteria has been updated." });
  } catch (error) {
    console.log(error);
    return json(
      { message: "Unknown error occured." },
      { status: StatusCodes.INTERNAL_SERVER_ERROR }
    );
  }
};

export const DELETE: RequestHandler = async ({ params }) => {
  try {
    const id = params?.criteriaId ?? "";
    await CooperativeCriteria.destroy({ where: { id } });
    return json({ message: "Criteria has been deleted." });
  } catch (error) {
    console.log(error);
    return json(
      { message: "Unknown error occured." },
      { status: StatusCodes.INTERNAL_SERVER_ERROR }
    );
  }
};
