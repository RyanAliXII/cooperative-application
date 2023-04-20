import { json } from "@sveltejs/kit";
import type { RequestHandler } from "@sveltejs/kit";
import type {
  CooperativeStats,
  MemberShare as MemberShareType,
  Share as ShareType,
} from "$lib/definitions/types";
import { sequelize } from "$lib/models/sequelize";
import {
  CooperativeStat,
  LiquidityLog,
  Share,
  ShareLog,
} from "$lib/models/model";
import { StatusCodes } from "http-status-codes";
import { EditSharesSchemaValidation } from "$lib/definitions/schema";
import {
  ShareLogDescription,
  SharesTransactionTypes,
} from "$lib/internal/transaction";

export const PUT: RequestHandler = async ({ request, params, locals }) => {
  const shareId = params.shareId;
  const { session } = locals.session;
  const coopId = session.data?.cooperative?.id;
  const body: ShareType = await request.json();
  const transaction = await sequelize.transaction();
  try {
    const parsedBody = await EditSharesSchemaValidation.validate(body);
    if (
      !Object.values(SharesTransactionTypes).includes(
        parsedBody.type as SharesTransactionTypes
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
    const shareModel = await Share.findOne({
      where: {
        id: shareId,
        cooperativeId: coopId,
      },
      transaction,
    });

    const share: ShareType = shareModel?.get({ plain: true });

    if (!share || !shareModel) {
      transaction.rollback();
      return json(
        { message: "Invalid body and id params." },
        { status: StatusCodes.BAD_REQUEST }
      );
    }

    await shareModel.update(
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
    await ShareLog.create(
      {
        value: stat.shares,
        description: ShareLogDescription.Edit,
        cooperativeId: coopId,
      },
      { transaction }
    );
    await LiquidityLog.create(
      {
        value: stat.liquidity,
        description: ShareLogDescription.Edit,
        cooperativeId: coopId,
      },
      { transaction }
    );
    await transaction.commit();
    return json({ message: "Share has been updated." });
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
  const { params, locals } = event;
  const shareId = params.shareId;
  const transaction = await sequelize.transaction();
  const { session } = locals.session;
  const coopId = session.data?.cooperative?.id;
  try {
    const shareModel = await Share.findOne({
      where: {
        id: shareId,
        cooperativeId: coopId,
      },
      transaction,
    });
    const share: ShareType = shareModel?.get({ plain: true });

    if (!share || !shareModel) {
      transaction.rollback();
      return json(
        { message: "Invalid body and id params." },
        { status: StatusCodes.BAD_REQUEST }
      );
    }

    await shareModel.destroy({ transaction });

    const statModel = await CooperativeStat.findOne({
      where: { cooperativeId: coopId },
      transaction,
    });
    if (!statModel) {
      return json({ message: "Cooperative has no stats" });
    }
    const stat = statModel.get({ plain: true }) as CooperativeStats;
    await ShareLog.create(
      {
        value: stat.shares,
        description: ShareLogDescription.Delete,
        cooperativeId: coopId,
      },
      { transaction }
    );
    await LiquidityLog.create(
      {
        value: stat.liquidity,
        description: ShareLogDescription.Delete,
        cooperativeId: coopId,
      },
      { transaction }
    );
    await transaction.commit();
    return json({ message: "Share has been deleted." });
  } catch (error) {
    console.log(error);
    transaction.rollback();
    return json(
      { message: "Unknown error occured." },
      { status: StatusCodes.INTERNAL_SERVER_ERROR }
    );
  }
};
