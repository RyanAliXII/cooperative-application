import { json, type RequestHandler } from "@sveltejs/kit";
import { StatusCodes } from "http-status-codes";
import { ENCRYPTION_KEY } from "$env/static/private";
import { Member, MemberAccount, Session } from "$lib/models/model";
import type { Member as MemberType } from "$lib/definitions/types";
import { NewMemberValidationSchema } from "$lib/definitions/schema";
import { sequelize } from "$lib/models/sequelize";
import generator from "generate-password";
import { hash } from "bcrypt";

export const POST: RequestHandler = async ({ request, cookies }) => {
  const sid = cookies.get("coop_sid");
  if (!sid) {
    return json(
      {
        message: "Invalid SID",
      },
      {
        status: StatusCodes.UNAUTHORIZED,
      }
    );
  }
  const transaction = await sequelize.transaction();
  try {
    const session = await Session.findOne({
      where: {
        sid: sid,
      },
    });

    if (!session) {
      return json(
        {
          message: "Invalid SID",
        },
        {
          status: StatusCodes.UNAUTHORIZED,
        }
      );
    }
    //data from session
    const coopId = session.dataValues?.data?.cooperative?.id;
    const body: MemberType = await request.json();
    const data = await NewMemberValidationSchema.validate(body);
    const member = await Member.create(
      { ...data, cooperativeId: coopId, approvedAt: sequelize.fn("NOW") },
      { transaction }
    );

    const password = generator.generate({
      strict: true,
    });

    const hashedPassword = await hash(password, 5);
    await MemberAccount.create(
      {
        ...data.account,
        memberId: member?.dataValues?.id,
        password: hashedPassword,
      },
      { transaction }
    );
    transaction.commit();

    return json(
      {
        message: "Member has been registered",
        data: {
          account: {
            email: data.account.email,
            password,
          },
        },
      },
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
