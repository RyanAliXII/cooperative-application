import { sequelize } from "$lib/models/sequelize";
import { json } from "@sveltejs/kit";

import type { RequestHandler } from "./$types";
import { StatusCodes } from "http-status-codes";

import { Member, Share, ShareLog } from "$lib/models/model";
import { AddSharesSchemaValidation } from "$lib/definitions/schema";
import {
  ShareLogDescription,
  SharesTransactionTypes,
} from "$lib/internal/transaction";

export const POST: RequestHandler = async (event) => {
  const transaction = await sequelize.transaction();
  const { request, locals } = event;
  try {
    const { session } = locals.session;
    const coopId = session.data?.cooperative?.id;
    const body = await request.json();
    const parsedShare = await AddSharesSchemaValidation.validate(body);

    if (
      !Object.values(SharesTransactionTypes).includes(
        parsedShare.type as SharesTransactionTypes
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
    await Share.create(
      {
        type: parsedShare.type,
        remarks: parsedShare.remarks,
        memberId: parsedShare.memberId,
        amount: parsedShare.amount,
        cooperativeId: coopId,
      },
      { transaction }
    );

    const [result, _] = await sequelize.query(
      `SELECT (SELECT COALESCE(SUM(share.amount), 0)  FROM share where type = 'Deposit' and cooperative_id = :coopId and deleted_at is null ) 
      - (SELECT COALESCE(SUM(share.amount), 0)  FROM share where type = 'Withdraw' and cooperative_id = :coopId and deleted_at is null)  as total`,
      {
        replacements: {
          coopId,
        },
        transaction,
      }
    );
    const overallShare = result[0] as { total: number };
    await ShareLog.create(
      {
        value: overallShare.total,
        description:
          parsedShare.type === SharesTransactionTypes.Deposit
            ? ShareLogDescription.New
            : ShareLogDescription.Withdraw,
        cooperativeId: coopId,
      },
      { transaction }
    );
    transaction.commit();
    return json({ message: "Share has been added." });
  } catch (error) {
    console.log(error);
    transaction.rollback();
    return json(
      { message: "Unknown error occured." },
      { status: StatusCodes.INTERNAL_SERVER_ERROR }
    );
  }
};

export const GET: RequestHandler = async (event) => {
  const { locals, url } = event;
  try {
    const { session } = locals.session;
    const coopId = session.data?.cooperative.id;
    const shareTransactionType = url.searchParams.get("type");
    if (!shareTransactionType) {
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
      !Object.values(SharesTransactionTypes).includes(
        shareTransactionType as SharesTransactionTypes
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
    const shareModel = await Share.findAll({
      where: {
        cooperativeId: coopId,
        type: shareTransactionType,
      },

      order: [["created_at", "desc"]],
      include: [
        {
          model: Member,
        },
      ],
    });
    return json({
      message: "Shares has been fetched.",
      data: {
        shares: shareModel?.map((log) => log.get({ plain: true })) ?? [],
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
