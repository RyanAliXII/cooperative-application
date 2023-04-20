import { EditSavingSchemaValidation } from "$lib/definitions/schema";
import type { Saving as SavingType } from "$lib/definitions/types";
import {
  SavingLogDescription,
  SavingsTransactionTypes,
} from "$lib/internal/transaction";
import { Saving, SavingLog } from "$lib/models/model";
import { SavingModel } from "$lib/models/saving";
import { sequelize } from "$lib/models/sequelize";
import { json, type RequestHandler } from "@sveltejs/kit";
import { StatusCodes } from "http-status-codes";
import { QueryTypes } from "sequelize";

export const PUT: RequestHandler = async ({ params, locals, request }) => {
  const transaction = await sequelize.transaction();
  try {
    const savingId = params.savingId;
    const { session } = locals.session;
    const coopId = session.data?.cooperative?.id;
    const body = await request.json();
    const parsedBody = await EditSavingSchemaValidation.validate(body);
    const savingModel = await Saving.findOne({
      where: {
        id: savingId,
        cooperativeId: coopId,
      },
      transaction,
    });

    if (!savingModel) {
      transaction.rollback();
      return json(
        { message: "Invalid body and id params." },
        { status: StatusCodes.BAD_REQUEST }
      );
    }

    await savingModel.update(
      {
        remarks: parsedBody.remarks,
        amount: parsedBody.amount,
        memberId: parsedBody.memberId,
      },
      { transaction }
    );

    const result = await sequelize.query(
      "SELECT COALESCE(SUM(saving.amount), 0) as total FROM saving where saving.cooperative_id = :coopId and saving.type=:type and deleted_at is null",
      {
        transaction,
        replacements: {
          coopId,
          type: SavingsTransactionTypes.Deposit,
        },
        type: QueryTypes.SELECT,
      }
    );
    const overallSaving = result[0] as { total: number };
    await SavingLog.create(
      {
        value: overallSaving.total,
        description: SavingLogDescription.Edit,
        cooperativeId: coopId,
      },
      { transaction }
    );
    transaction.commit();
    return json({ message: "Saving has been updated." });
  } catch (error) {
    transaction.rollback();
    console.log(error);
    return json(
      { message: "Unknown error occured" },
      { status: StatusCodes.INTERNAL_SERVER_ERROR }
    );
  }
};
export const DELETE: RequestHandler = async ({ params, locals }) => {
  const transaction = await sequelize.transaction();
  try {
    const savingId = params.savingId;
    const { session } = locals.session;
    const coopId = session.data?.cooperative?.id;

    const savingModel = await Saving.findOne({
      where: {
        id: savingId,
        cooperativeId: coopId,
      },
      transaction,
    });

    if (!savingModel) {
      transaction.rollback();
      return json(
        { message: "Invalid body and id params." },
        { status: StatusCodes.BAD_REQUEST }
      );
    }

    await savingModel.destroy({ transaction });

    const result = await sequelize.query(
      "SELECT COALESCE(SUM(saving.amount), 0) as total FROM saving where saving.cooperative_id = :coopId and saving.type=:type and deleted_at is null",
      {
        transaction,
        replacements: {
          coopId,
          type: SavingsTransactionTypes.Deposit,
        },
        type: QueryTypes.SELECT,
      }
    );
    const overallSaving = result[0] as { total: number };
    await SavingLog.create(
      {
        value: overallSaving.total,
        description: SavingLogDescription.Delete,
        cooperativeId: coopId,
      },
      { transaction }
    );
    transaction.commit();
    return json({ message: "Saving has been deleted." });
  } catch (error) {
    console.log(error);
    transaction.rollback();
    return json(
      { message: "Unknown error occured" },
      { status: StatusCodes.INTERNAL_SERVER_ERROR }
    );
  }
};
