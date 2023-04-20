import { EditSavingSchemaValidation } from "$lib/definitions/schema";
import type {
  CooperativeStats,
  Saving as SavingType,
} from "$lib/definitions/types";
import {
  SavingLogDescription,
  SavingsTransactionTypes,
} from "$lib/internal/transaction";
import {
  CooperativeStat,
  LiquidityLog,
  Saving,
  SavingLog,
} from "$lib/models/model";
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

    const statModel = await CooperativeStat.findOne({
      where: { cooperativeId: coopId },
      transaction,
    });
    if (!statModel) {
      return json({ message: "Cooperative has no stats" });
    }
    const stat = statModel.get({ plain: true }) as CooperativeStats;
    await SavingLog.create(
      {
        value: stat.savings,
        description: SavingLogDescription.Edit,
        cooperativeId: coopId,
      },
      { transaction }
    );
    await LiquidityLog.create(
      {
        value: stat.liquidity,
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

    const statModel = await CooperativeStat.findOne({
      where: { cooperativeId: coopId },
      transaction,
    });
    if (!statModel) {
      return json({ message: "Cooperative has no stats" });
    }
    const stat = statModel.get({ plain: true }) as CooperativeStats;
    await SavingLog.create(
      {
        value: stat.savings,
        description: SavingLogDescription.Delete,
        cooperativeId: coopId,
      },
      { transaction }
    );
    await LiquidityLog.create(
      {
        value: stat.liquidity,
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
