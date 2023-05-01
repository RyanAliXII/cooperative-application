import { CreateCriteriaValidation } from "$lib/definitions/schema";
import type { CooperativeCriteria as CooperativeCriteriaType } from "$lib/definitions/types";
import { CooperativeCriteria, CriteriaField } from "$lib/models/model";
import { sequelize } from "$lib/models/sequelize";
import { json, type RequestHandler } from "@sveltejs/kit";
import { StatusCodes } from "http-status-codes";

export const POST: RequestHandler = async ({ request }) => {
  const transaction = await sequelize.transaction();
  try {
    const body = await request.json();
    const parsedBody = await CreateCriteriaValidation.validate(body);
    const criteria = await CooperativeCriteria.create(parsedBody, {
      transaction,
    });
    const criteriaId = criteria.dataValues.id;
    const criteriaFields =
      parsedBody.criteriaFields?.map((d) => {
        const c = { ...d, criteriaId };
        return c;
      }) ?? [];
    await CriteriaField.bulkCreate(criteriaFields, { transaction });
    await transaction.commit();
    return json({ message: "Criteria has been created." });
  } catch (error) {
    console.log(error);
    transaction.rollback();
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
      include: [
        {
          model: CriteriaField,
          as: "criteriaFields",
        },
      ],
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
