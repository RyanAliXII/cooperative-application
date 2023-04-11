import { sequelize } from "$lib/models/sequelize";
import { json } from "@sveltejs/kit";

import type { RequestHandler } from "./$types";
import { StatusCodes } from "http-status-codes";

import { Member, Session, Shares, SharesLog } from "$lib/models/model";
import { AddSharesSchemaValidation } from "$lib/definitions/schema";
import { SharesTransactionTypes } from "$lib/internal/transaction";

export const POST: RequestHandler = async ({ request, cookies }) => {
  const transaction = await sequelize.transaction();
  const sid = cookies.get("coop_sid");
  try {
    const sessionModel = await Session.findOne({
      where: {
        sid: sid,
      },
    });

    if (!sessionModel) {
      return json(
        {
          message: "Invalid SID",
        },
        {
          status: StatusCodes.UNAUTHORIZED,
        }
      );
    }
    const session = sessionModel.get({ plain: true });
    const coopId = session?.data?.cooperative?.id;
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
      sharesModel.increment("total", { by: shares.amount, transaction });
    }

    await SharesLog.create(
      {
        type: SharesTransactionTypes.Deposit,
        remarks: shares.remarks,
        memberId: shares.memberId,
        amount: shares.amount,
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

export const GET: RequestHandler = async ({ cookies }) => {
  try {
    const sid = cookies.get("coop_sid");

    const sessionModel = await Session.findOne({
      where: {
        sid: sid,
      },
    });

    if (!sessionModel) {
      return json(
        {
          message: "Invalid SID",
        },
        {
          status: StatusCodes.UNAUTHORIZED,
        }
      );
    }
    const session = sessionModel.get({ plain: true });
    const coopId = session?.data?.cooperative?.id;

    const sharesLogModel = await SharesLog.findAll({
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
        sharesLogs: sharesLogModel.map((log) => log.get({ plain: true })) ?? [],
      },
    });
  } catch {
    return json({}, { status: StatusCodes.INTERNAL_SERVER_ERROR });
  }
};
