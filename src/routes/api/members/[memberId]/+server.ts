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

export const GET: RequestHandler = async ({ locals, params }) => {
  try {
    const { session } = locals.session;
    //data from session
    const coopId = session.data?.cooperative?.id;
    const memberId = params?.memberId;

    const [results, _] = await sequelize.query(
      `
        SELECT member.id, given_name as "givenName", 
          surname as "surname", 
          middle_name as "middleName", 
          json_build_object('id', ma.id, 'email', ma.email, 'memberId', ma.member_id) as account,
          (COALESCE(SUM(ds.amount), 0) - COALESCE(SUM(ws.amount), 0))  as share
          FROM member
          INNER JOIN member_account as ma on member.id = ma.member_id
          LEFT JOIN share as ds on member.id = ds.member_id and ds.deleted_at is null and ds.type = 'Deposit'
		      LEFT JOIN share as ws on member.id = ws.member_id and ws.deleted_at is null and ws.type = 'Withdraw'
          where member.id = :memberId and member.cooperative_id = :coopId
          GROUP BY  member.id, ma.id, ma.email, ma.member_id  
        `,
      {
        replacements: {
          memberId,
          coopId,
        },
      }
    );
    if (!results) {
      return json(
        { message: "member not fond" },
        { status: StatusCodes.NOT_FOUND }
      );
    }
    const member = results?.[0] as MemberType;
    return json({
      message: "Member has been fetched.",
      data: {
        member,
      },
    });
  } catch (error) {
    console.error(error);
    return json(
      { message: "Unknown error occured." },
      { status: StatusCodes.INTERNAL_SERVER_ERROR }
    );
  }
};
