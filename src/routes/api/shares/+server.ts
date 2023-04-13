import { sequelize } from "$lib/models/sequelize";
import { json } from "@sveltejs/kit";

import type { RequestHandler } from "./$types";
import { StatusCodes } from "http-status-codes";

import { Member, Share, MemberShare } from "$lib/models/model";
import { AddSharesSchemaValidation } from "$lib/definitions/schema";
import { SharesTransactionTypes } from "$lib/internal/transaction";

export const POST: RequestHandler = async (event) => {
  const transaction = await sequelize.transaction();
  const { request, locals } = event;
  try {
    const { session } = locals.session;
    const coopId = session.data?.cooperative?.id;
    const body = await request.json();
    const parsedShare = await AddSharesSchemaValidation.validate(body);
    const sharesModel = await MemberShare.findOne({
      where: {
        memberId: parsedShare?.memberId,
      },
    });

    if (!sharesModel) {
      MemberShare.create(
        {
          memberId: parsedShare?.memberId,
          total: parsedShare?.amount,
        },
        { transaction }
      );
    } else {
      sharesModel.increment("total", { by: parsedShare.amount, transaction });
    }

    await Share.create(
      {
        type: SharesTransactionTypes.Deposit,
        remarks: parsedShare.remarks,
        memberId: parsedShare.memberId,
        amount: parsedShare.amount,
        cooperativeId: coopId,
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

export const GET: RequestHandler = async (event) => {
  const { locals } = event;
  try {
    const { session } = locals.session;
    const coopId = session.data?.cooperative.id;
    const shareModel = await Share.findAll({
      where: {
        cooperativeId: coopId,
      },
      order: [["created_at", "desc"]],
      include: [
        {
          model: Member,
        },
      ],
    });

    return json({
      message: "Shares Logs has been fetched.",
      data: {
        shares: shareModel.map((log) => log.get({ plain: true })) ?? [],
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
