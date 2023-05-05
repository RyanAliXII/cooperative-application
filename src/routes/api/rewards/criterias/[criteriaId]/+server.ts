import { EditCriteriaValidation } from "$lib/definitions/schema";
import { CooperativeCriteria, CriteriaField } from "$lib/models/model";
import { sequelize } from "$lib/models/sequelize";
import { json, type RequestHandler } from "@sveltejs/kit";
import { StatusCodes } from "http-status-codes";

export const PUT: RequestHandler = async ({ request, params }) => {
  const transaction = await sequelize.transaction();
  try {
    const id = params?.criteriaId ?? "";
    const body = await request.json();
    const parsedBody = await EditCriteriaValidation.validate(body);
    await CooperativeCriteria.update(parsedBody, {
      where: { id },
      transaction,
    });
    await CriteriaField.destroy({
      where: {
        criteriaId: id,
      },
      transaction,
    });

    const criteriaFields =
      parsedBody.criteriaFields?.map((d) => {
        const c = { ...d, criteriaId: id };
        return c;
      }) ?? [];
    await CriteriaField.bulkCreate(criteriaFields, { transaction });
    transaction.commit();
    return json({ message: "Criteria has been updated." });
  } catch (error) {
    console.log(error);
    transaction.rollback();
    return json(
      { message: "Unknown error occured." },
      { status: StatusCodes.INTERNAL_SERVER_ERROR }
    );
  }
};

export const DELETE: RequestHandler = async ({ params }) => {
  const transaction = await sequelize.transaction();
  try {
    const id = params?.criteriaId ?? "";
    await CooperativeCriteria.destroy({ where: { id } });
    await CriteriaField.destroy({ where: { criteriaId: id } });
    transaction.commit();
    return json({ message: "Criteria has been deleted." });
  } catch (error) {
    console.log(error);
    transaction.rollback();
    return json(
      { message: "Unknown error occured." },
      { status: StatusCodes.INTERNAL_SERVER_ERROR }
    );
  }
};
