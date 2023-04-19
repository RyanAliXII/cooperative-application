import { json } from "@sveltejs/kit";
import type { RequestHandler } from "../$types";
import { sequelize } from "$lib/models/sequelize";
import { StatusCodes } from "http-status-codes";
import { SharesTransactionTypes } from "$lib/internal/transaction";

export const GET: RequestHandler = async ({ cookies, locals, url }) => {
  try {
    const { session } = locals.session;
    const coopId = session.data?.cooperative?.id;

    const shareTransactionType = url.searchParams.get("type");
    if (!shareTransactionType) {
      return json(
        {
          message: "Transaction type not defined.",
          data: { share: { total: 0 } },
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
        { message: "Invalid transaction type.", data: { share: { total: 0 } } },
        { status: StatusCodes.BAD_REQUEST }
      );
    }

    const [result, _] = await sequelize.query(
      "SELECT COALESCE(SUM(share.amount), 0) as total FROM share inner join member on member_id = member.id where share.cooperative_id = :coopId and share.type=:type and deleted_at is null",
      {
        replacements: {
          coopId,
          type: shareTransactionType,
        },
      }
    );
    return json({
      message: "Shares total fetched.",
      data: {
        shares: result?.[0] ?? { total: 0 },
      },
    });
  } catch (error) {
    console.log(error);
    return json(
      {
        message: "unknown error occured.",
        data: {
          shares: { total: 0 },
        },
      },
      { status: StatusCodes.INTERNAL_SERVER_ERROR }
    );
  }
};
