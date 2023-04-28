import { CreateCooperativeCategoryValidation } from "$lib/definitions/schema";
import { CooperativeCategory } from "$lib/models/model";
import { json, type RequestHandler } from "@sveltejs/kit";
import { StatusCodes } from "http-status-codes";

export const POST: RequestHandler = async ({ request }) => {
  try {
    const body = await request.json();
    const parsedBody = await CreateCooperativeCategoryValidation.validate(body);
    await CooperativeCategory.create(parsedBody);
    return json({ message: "Category created successfully." });
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

export const GET: RequestHandler = async ({}) => {
  try {
    const categoryModel = await CooperativeCategory.findAll();

    return json({
      message: "Category fetched successfully.",
      data: {
        categories: categoryModel?.map((c) => c.get()) ?? [],
      },
    });
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
