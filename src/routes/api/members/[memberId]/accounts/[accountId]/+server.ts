import { json, type RequestHandler } from "@sveltejs/kit";
import { StatusCodes } from "http-status-codes";

import { Member, MemberAccount } from "$lib/models/model";

import { sequelize } from "$lib/models/sequelize";

export const PATCH: RequestHandler = async ({ request, params }) => {
  const coopId = params?.cooperativeId;
  const accountId = params?.accountId;
  const body = await request.json();
  try {
    const account = await MemberAccount.findOne({
      where: {
        id: accountId,
      },
      include: [
        {
          required: true,
          model: Member,
          where: {
            cooperativeId: coopId,
          },
        },
      ],
    });

    if (!account) {
      return json(
        { message: "Invalid id params" },
        { status: StatusCodes.BAD_REQUEST }
      );
    }

    if (body.approved) {
      account.update({
        approvedAt: sequelize.fn("NOW"),
      });
    }
    if (body.declined) {
      account.update({
        rejectedAt: sequelize.fn("NOW"),
      });
    }
    return json({ message: "Account has been updated." });
  } catch (error) {
    console.log(error);
    return json(
      { message: "Unknown error occured." },
      { status: StatusCodes.INTERNAL_SERVER_ERROR }
    );
  }
};
