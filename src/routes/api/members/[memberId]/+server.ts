import { json, type RequestHandler } from "@sveltejs/kit";
import { StatusCodes } from "http-status-codes";

import { Member, MemberAccount } from "$lib/models/model";
import { EditMemberValidationSchema } from "$lib/definitions/schema";
import type { Member as MemberType } from "$lib/definitions/types";
import { sequelize } from "$lib/models/sequelize";

export const PUT: RequestHandler = async ({ request, params }) => {
  const memberId = params?.memberId;
  if (!memberId) {
    return json({ message: "Invalid id" }, { status: StatusCodes.BAD_REQUEST });
  }

  const transaction = await sequelize.transaction();
  try {
    const body: MemberType = await request.json();
    const data = await EditMemberValidationSchema.validate(body);
    await Member.update(data, {
      where: {
        id: memberId,
      },
      transaction,
    });

    await MemberAccount.update(data.account, {
      where: {
        memberId: memberId,
      },
      transaction,
    });
    transaction.commit();
    return json(
      { message: "Member has been updated." },
      { status: StatusCodes.OK }
    );
  } catch (error) {
    transaction.rollback();
    console.error(error);
    return json(
      { message: "Unknown error occured." },
      { status: StatusCodes.INTERNAL_SERVER_ERROR }
    );
  }
};

export const PATCH: RequestHandler = async ({ request, params }) => {
  const memberId = params?.memberId;
  const body = await request.json();
  try {
    const member = await Member.findOne({
      where: {
        id: memberId,
      },
    });

    if (!member) {
      return json(
        { message: "Invalid id params" },
        { status: StatusCodes.BAD_REQUEST }
      );
    }

    if (body.approved) {
      member.update({
        approvedAt: sequelize.fn("NOW"),
      });
    }
    if (body.declined) {
      member.update({
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
