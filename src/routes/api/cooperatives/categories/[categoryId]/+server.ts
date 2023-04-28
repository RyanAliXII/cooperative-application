import { EditCooperativeCategoryValidation } from "$lib/definitions/schema";
import { CooperativeCategory } from "$lib/models/model";
import { json, type RequestHandler } from "@sveltejs/kit";
import { StatusCodes } from "http-status-codes";

export const PUT: RequestHandler = async ({ params, request }) => {
  const id = params?.categoryId;

  try {
    const body = await request.json();
    const parsedBody = await EditCooperativeCategoryValidation.validate(body);
    await CooperativeCategory.update(parsedBody, { where: { id: id } });
    return json({ message: "Category has been updated." });
  } catch (error) {
    console.log(error);
    return json(
      {
        error: "Unknown errror occurred.",
      },
      { status: StatusCodes.INTERNAL_SERVER_ERROR }
    );
  }
};

export const DELETE: RequestHandler = async ({ params }) => {
  const id = params?.categoryId;
  try {
    await CooperativeCategory.destroy({ where: { id: id } });
    return json({ message: "Category has deleted." });
  } catch (error) {
    console.log(error);
    return json(
      {
        error: "Unknown errror occurred.",
      },
      { status: StatusCodes.INTERNAL_SERVER_ERROR }
    );
  }
};
