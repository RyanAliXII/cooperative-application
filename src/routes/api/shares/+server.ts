import { sequelize } from "$lib/models/sequelize";
import { json } from "@sveltejs/kit";

import type { RequestHandler } from "./$types";
import { StatusCodes } from "http-status-codes";

import { Shares, SharesLog } from "$lib/models/model";
import { AddSharesSchemaValidation } from "$lib/definitions/schema";
import { SharesTransactionTypes } from "$lib/internal/transaction";

export const POST: RequestHandler = async ({ request }) => {
  const transaction = await sequelize.transaction();
  try {
    const body = await request.json();
    const shares = await AddSharesSchemaValidation.validate(body);
    const sharesModel = await Shares.findOne({
      where: {
        memberId: shares?.memberId,
      },
    });

    if (!sharesModel) {
      Shares.create(
        {
          memberId: shares?.memberId,
          total: shares?.amount,
        },
        { transaction }
      );
    } else {
      sharesModel.increment("total", { by: shares?.amount, transaction });
    }
    await SharesLog.create(
      {
        type: SharesTransactionTypes.Deposit,
        remarks: shares?.remarks,
        memberId: shares?.memberId,
        amount: shares?.amount,
      },
      { transaction }
    );
    transaction.commit();
    return json({ message: "Shares has been added." });
  } catch (error) {
    console.log(error);
    transaction.rollback();
    return json(
      { message: "Unknown error occured." },
      { status: StatusCodes.INTERNAL_SERVER_ERROR }
    );
  }
};
