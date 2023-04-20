import type { RequestHandler } from "@sveltejs/kit";
import { StatusCodes } from "http-status-codes";
import { json } from "@sveltejs/kit";
import { sequelize } from "$lib/models/sequelize";
import { AddSavingSchemaValidation } from "$lib/definitions/schema";
import {
  CooperativeStat,
  LiquidityLog,
  Member,
  Saving,
  SavingLog,
} from "$lib/models/model";
import {
  SavingLogDescription,
  SavingsTransactionTypes,
} from "$lib/internal/transaction";
import { QueryTypes } from "sequelize";
import type { CooperativeStats } from "$lib/definitions/types";

export const POST: RequestHandler = async ({ request, locals }) => {
  const transaction = await sequelize.transaction();
  try {
    const { session } = locals.session;
    const coopId = session.data?.cooperative?.id;
    const body = await request.json();
    const parsedBody = await AddSavingSchemaValidation.validate(body);
    await Saving.create(
      {
        type: parsedBody.type,
        remarks: parsedBody.remarks,
        memberId: parsedBody.memberId,
        amount: parsedBody.amount,
        cooperativeId: coopId,
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
        description:
          parsedBody.type === SavingsTransactionTypes.Deposit
            ? SavingLogDescription.New
            : SavingLogDescription.Withdraw,
        cooperativeId: coopId,
      },
      { transaction }
    );
    await LiquidityLog.create(
      {
        value: stat.liquidity,
        description:
          parsedBody.type === SavingsTransactionTypes.Deposit
            ? SavingLogDescription.New
            : SavingLogDescription.Withdraw,
        cooperativeId: coopId,
      },
      { transaction }
    );
    await transaction.commit();
    return json({ message: "Saving has been added." });
  } catch (error) {
    console.log(error);
    await transaction.rollback();
    return json(
      { message: "Unknown error occured" },
      { status: StatusCodes.INTERNAL_SERVER_ERROR }
    );
  }
};

export const GET: RequestHandler = async ({ locals, request, url }) => {
  try {
    const { session } = locals.session;
    const coopId = session.data?.cooperative?.id;
    const savingTransactionType = url.searchParams.get("type");
    if (!savingTransactionType) {
      return json(
        {
          message: "Transaction type not defined.",
          data: {
            shares: [],
          },
        },
        { status: StatusCodes.BAD_REQUEST }
      );
    }

    if (
      !Object.values(SavingsTransactionTypes).includes(
        savingTransactionType as SavingsTransactionTypes
      )
    ) {
      return json(
        {
          message: "Invalid transaction type.",
          data: {
            shares: [],
          },
        },
        { status: StatusCodes.BAD_REQUEST }
      );
    }

    const savings = await Saving.findAll({
      where: {
        cooperativeId: coopId,
        type: savingTransactionType,
      },

      order: [["created_at", "desc"]],
      include: [
        {
          model: Member,
        },
      ],
    });
    return json({
      message: "Saving has been fetched.",
      data: {
        savings: savings?.map((s) => s.get({ plain: true })) ?? [],
      },
    });
  } catch (error) {
    console.log(error);
    return json(
      { message: "Unknown error occured" },
      { status: StatusCodes.INTERNAL_SERVER_ERROR }
    );
  }
};
