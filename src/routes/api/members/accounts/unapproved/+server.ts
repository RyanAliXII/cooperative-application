import { json, type RequestHandler } from "@sveltejs/kit";
import { StatusCodes } from "http-status-codes";

import { Member, MemberAccount, Session } from "$lib/models/model";

export const GET: RequestHandler = async ({ request, cookies }) => {
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

    const memberModel = await MemberAccount.findAll({
      include: [
        {
          required: true,
          model: Member,
          as: "member",
          where: {
            cooperativeId: coopId,
            approvedAt: null,
          },
        },
      ],
    });

    return json(
      {
        message: "Unapproved members has been fetched.",
        data: {
          members:
            memberModel.map((member) => member.get({ plain: true })) ?? [],
        },
      },
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
