import { sequelize } from "$lib/models/sequelize";
import { json, type RequestHandler } from "@sveltejs/kit";
import { StatusCodes } from "http-status-codes";
import { Cooperative, CooperativeAccount } from "$lib/models/model";
import { validate } from "uuid";
import { EditCooperativeSchema } from "$lib/definitions/schema";
export const PUT: RequestHandler = async ({ request, params }) => {
  const transaction = await sequelize.transaction();

  const body = await request.json();
  const coopId = params?.cooperativeId ?? "";
  const isIdValid = validate(coopId);
  if (!isIdValid) {
    return json(
      {
        message: "Invalid id",
        data: null,
      },
      {
        status: StatusCodes.BAD_REQUEST,
      }
    );
  }
  try {
    const data = await EditCooperativeSchema.validate(body);
    await Cooperative.update(data, {
      where: {
        id: coopId,
      },
      transaction: transaction,
    });
    await CooperativeAccount.update(data?.account, {
      where: {
        id: data?.account?.id,
      },
      transaction: transaction,
    });
    await transaction.commit();
    return json(
      {
        message: "Coop update.",
        data: {
          account: {},
        },
      },
      { status: StatusCodes.OK }
    );
  } catch (error) {
    await transaction.rollback();

    return json(
      { message: "Unknown error occured.", data: null },
      { status: StatusCodes.INTERNAL_SERVER_ERROR }
    );
  }
};
