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
