import { json, type RequestHandler } from "@sveltejs/kit";
import { StatusCodes } from "http-status-codes";

import { Member, Session } from "$lib/models/model";
import { NewMemberValidationSchema } from "$lib/definitions/schema";

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
    const body = await request.json();
    const data = await NewMemberValidationSchema.validate(body);
    await Member.create({ ...data, cooperativeId: coopId });
    return json(
      { message: "Member has been registered" },
      { status: StatusCodes.OK }
    );
  } catch (error) {
    console.error(error);
    return json(
      { message: "Unknown error occured." },
      { status: StatusCodes.INTERNAL_SERVER_ERROR }
    );
  }
};
