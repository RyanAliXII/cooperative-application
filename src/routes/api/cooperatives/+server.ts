import { sequelize } from "$lib/models/sequelize";
import { json, type RequestHandler } from "@sveltejs/kit";
import { StatusCodes } from "http-status-codes";
import { hash } from "bcrypt";
import generator from "generate-password";
import { Cooperative, CooperativeAccount } from "$lib/models/model";
export const POST: RequestHandler = async ({ request }) => {
  const transaction = await sequelize.transaction();
  const body = await request.json();

  try {
    const coop = await Cooperative.create(body, { transaction });
    const password = generator.generate({ strict: true });
    const hashedPassword = await hash(password, 5);
    const account = {
      ...body.account,
      cooperativeId: coop.dataValues.id,
      password: hashedPassword,
    };
    await CooperativeAccount.create(account, { transaction });
    await transaction.commit();
    return json(
      {
        message: "Coop created.",
        data: {
          account: {
            email: account.email,
            password: password,
          },
        },
      },
      { status: StatusCodes.OK }
    );
  } catch (error) {
    await transaction.rollback();
    console.error(error);
    return json(
      { message: "Unknown error occured.", data: null },
      { status: StatusCodes.INTERNAL_SERVER_ERROR }
    );
  }
};
