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
import { ENCRYPTION_KEY } from "$env/static/private";
import { AES } from "crypto-js";
export const POST: RequestHandler = async ({ request, cookies, params }) => {
  const body: MemberAccountType = await request.json();
  const transaction = await sequelize.transaction();
  try {
    const memberData = await Member.findOne({
      where: {
        givenName: body?.member?.givenName,
        surname: body?.member?.surname,
        birthday: body?.member?.birthday,
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
      { ...body.member, cooperativeId: coopId },
      {
        transaction,
      }
    );
    const member: MemberType = memberModel?.dataValues;
    await MemberAccount.create(
      {
        ...body,
        memberId: member.id,
      },
      { transaction }
    );

    /* 
      create token for successfull registration message
      this token expires in 5 minutes after registration.
    */
    const now = new Date();
    now.setMinutes(now.getMinutes() + 5);
    const token = AES.encrypt(
      JSON.stringify({
        expire: now.getTime(),
      }),
      ENCRYPTION_KEY
    );
    transaction.commit();
    return json(
      {
        message: "Account has been registered.",
        data: {
          token: token.toString(),
        },
      },
      {
        status: StatusCodes.OK,
      }
    );
  } catch (error) {
    console.log(error);
    transaction.rollback();

    return json(
      { message: "Unknown error occured" },
      { status: StatusCodes.INTERNAL_SERVER_ERROR }
    );
  }
};
