import type { CooperativeStats } from "$lib/definitions/types";
import { SavingsTransactionTypes } from "$lib/internal/transaction";
import { sequelize } from "$lib/models/sequelize";
import { json, type RequestHandler } from "@sveltejs/kit";
import { StatusCodes } from "http-status-codes";
import { QueryTypes } from "sequelize";

export const GET: RequestHandler = async ({ locals, url }) => {
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

    const result = await sequelize.query(
      "SELECT COALESCE(SUM(saving.amount), 0) as total FROM saving where saving.cooperative_id = :coopId and saving.type=:type and deleted_at is null",
      {
        replacements: {
          coopId,
          type: savingTransactionType,
        },
        type: QueryTypes.SELECT,
      }
    );
    if (result.length === 0) {
      return json(
        {
          message: "Invalid transaction type.",
          data: {
            shares: [],
          },
        },
        { status: StatusCodes.NOT_FOUND }
      );
    }
    const saving = result[0] as { total: number };
    return json({
      message: "Savings total has been fetched.",
      data: {
        savings: { total: Number(saving.total ?? 0) },
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
