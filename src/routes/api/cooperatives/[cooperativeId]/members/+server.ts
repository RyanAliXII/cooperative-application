import type {
  Member as MemberType,
  MemberAccount as MemberAccountType,
} from "$lib/definitions/types";
import { MemberAccount, Member } from "$lib/models/model";
import { sequelize } from "$lib/models/sequelize";
import { json, type RequestHandler } from "@sveltejs/kit";
import { StatusCodes } from "http-status-codes";
import { validate } from "uuid";
import { hash } from "bcrypt";
export const POST: RequestHandler = async ({ request, cookies, params }) => {
  const body: MemberAccountType = await request.json();
  const transaction = await sequelize.transaction();
  try {
    const memberData = await Member.findOne({
      where: {
        givenName: body?.givenName,
        surname: body?.surname,
        birthday: body?.birthday,
      },
    });
    if (memberData) {
      return json(
        {
          message:
            "Looks like you already have a record. Please contact the cooperative to resolve this issue.",
        },
        { status: StatusCodes.BAD_REQUEST }
      );
    }
    const coopId = params?.cooperativeId;
    if (!coopId) {
      return json(
        {
          message: "Invalid coop id",
        },
        { status: StatusCodes.BAD_REQUEST }
      );
    }
    if (!validate(coopId)) {
      return json(
        {
          message: "Invalid coop id",
        },
        { status: StatusCodes.BAD_REQUEST }
      );
    }
    body.password = await hash(body.password, 5);
    const memberModel = await Member.create(
      { ...body, cooperativeId: coopId },
      {
        transaction,
      }
    );
    const member: MemberType = memberModel?.dataValues;
    await MemberAccount.create(
      {
        ...body,
        cooperativeId: coopId,
        memberId: member.id,
      },
      { transaction }
    );

    transaction.commit();
    return json(
      {
        message: "Account has been registered.",
      },
      {
        status: StatusCodes.OK,
      }
    );
  } catch (error) {
    transaction.rollback();
    console.log(error);
    return json({ message: "Unknown error occured" });
  }
};
