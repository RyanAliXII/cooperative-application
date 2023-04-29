import { CreateCriteriaValidation } from "$lib/definitions/schema";
import type { CooperativeCriteria as CooperativeCriteriaType } from "$lib/definitions/types";
import { CooperativeCriteria } from "$lib/models/model";
import { json, type RequestHandler } from "@sveltejs/kit";
import { StatusCodes } from "http-status-codes";

export const POST: RequestHandler = async ({ request }) => {
  try {
    const body = await request.json();
    const parsedBody = await CreateCriteriaValidation.validate(body);
    await CooperativeCriteria.create(parsedBody);
    return json({ message: "Criteria has been created." });
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
    const criterias = await CooperativeCriteria.findAll({
      order: [["created_at", "desc"]],
    });
    return json({
      message: "Criteria has been created.",
      data: {
        criterias: (criterias?.map((c) => c.get({ plain: true })) ??
          []) as CooperativeCriteriaType[],
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
