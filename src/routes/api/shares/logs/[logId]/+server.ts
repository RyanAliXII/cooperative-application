import { json } from "@sveltejs/kit";
import type { RequestHandler } from "@sveltejs/kit";
import type {
  Shares as SharesType,
  SharesLog as SharesLogType,
} from "$lib/definitions/types";
import { sequelize } from "$lib/models/sequelize";
import { Shares, SharesLog } from "$lib/models/model";
import { StatusCodes } from "http-status-codes";
import { EditSharesSchemaValidation } from "$lib/definitions/schema";

export const PUT: RequestHandler = async ({ request, params }) => {
  const logId = params.logId;
  const body: SharesLogType = await request.json();
  const transaction = await sequelize.transaction();
  try {
    const parsedBody = await EditSharesSchemaValidation.validate(body);
    const sharesModel = await Shares.findOne({
      where: {
        memberId: parsedBody.memberId,
      },
      transaction,
    });

    const sharesLogModel = await SharesLog.findOne({
      where: {
        id: logId,
      },
      transaction,
    });

    const shares: SharesType = sharesModel?.get({ plain: true });
    const sharesLog: SharesLogType = sharesLogModel?.get({ plain: true });

    if (!shares || !sharesLog || !sharesLogModel || !sharesModel) {
      transaction.rollback();
      return json(
        { message: "Invalid body and id params." },
        { status: StatusCodes.BAD_REQUEST }
      );
    }
    const incrementOrDecrementValue = sharesLog.amount - parsedBody.amount;
    if (sharesLog.amount > parsedBody.amount) {
      sharesModel.decrement("total", {
        by: incrementOrDecrementValue,
        transaction,
      });
    } else {
      sharesModel.increment("total", {
        by: incrementOrDecrementValue,
        transaction,
      });
    }

    await sharesLogModel.update({
      remarks: parsedBody.remarks,
      amount: parsedBody.amount,
      memberId: parsedBody.memberId,
    });
    await transaction.commit();
    return json({ message: "Shares log has been updated." });
  } catch (error) {
    await transaction.rollback();
    console.log(error);
    return json(
      { message: "Unknown error occured." },
      { status: StatusCodes.INTERNAL_SERVER_ERROR }
    );
  }
};

export const DELETE: RequestHandler = async (event) => {
  const { params } = event;

  const logId = params.logId;
  const transaction = await sequelize.transaction();
  try {
    const sharesLogModel = await SharesLog.findOne({
      where: {
        id: logId,
      },
      transaction,
    });
    const sharesLog: SharesLogType = sharesLogModel?.get({ plain: true });
    const sharesModel = await Shares.findOne({
      where: {
        memberId: sharesLog.memberId,
      },
      transaction,
    });
    const shares: SharesType = sharesModel?.get({ plain: true });
    if (!shares || !sharesLog || !sharesLogModel || !sharesModel) {
      transaction.rollback();
      return json(
        { message: "Invalid body and id params." },
        { status: StatusCodes.BAD_REQUEST }
      );
    }
    await sharesModel.decrement("total", { by: sharesLog.amount, transaction });
    await sharesLogModel.destroy({ transaction });
    await transaction.commit();
    return json({ message: "Shares has been deleted." });
  } catch (error) {
    console.log(error);
    transaction.rollback();
    return json(
      { message: "Unknown error occured." },
      { status: StatusCodes.INTERNAL_SERVER_ERROR }
    );
  }
};
