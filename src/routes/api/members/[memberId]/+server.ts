import { json, type RequestHandler } from "@sveltejs/kit";
import { StatusCodes } from "http-status-codes";

import { Member, MemberAccount } from "$lib/models/model";
import { EditMemberValidationSchema } from "$lib/definitions/schema";
import type { Member as MemberType } from "$lib/definitions/types";
import { sequelize } from "$lib/models/sequelize";
import { QueryTypes } from "sequelize";

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

    const results = await sequelize.query(
      `
      SELECT member.id, given_name as "givenName", 
      surname as "surname", 
      middle_name as "middleName", 
      json_build_object('id', ma.id, 'email', ma.email, 'memberId', ma.member_id) as account,
      (COALESCE(COALESCE(d_share.share, 0) - COALESCE(w_share.share,0), 0))  as share,
       (COALESCE(COALESCE(d_saving.saving, 0) - COALESCE(w_saving.saving, 0), 0))  as saving
          FROM member
          INNER JOIN member_account as ma on member.id = ma.member_id
      LEFT JOIN (
        SELECT member_id ,SUM(amount) as share from share where deleted_at is null and type = 'Deposit' group by member_id
      ) as d_share on member.id = d_share.member_id
      LEFT JOIN (
        SELECT member_id ,SUM(amount) as share from share where deleted_at is null and type = 'Withdraw' group by member_id
      ) as w_share on member.id = w_share.member_id
      LEFT JOIN (
        SELECT member_id ,SUM(amount) as saving from saving where deleted_at is null and type = 'Deposit' group by member_id
      ) as d_saving on member.id = d_saving.member_id
      LEFT JOIN (
        SELECT member_id ,SUM(amount) as saving from saving where deleted_at is null and type = 'Withdraw' group by member_id
      ) as w_saving on member.id = w_saving.member_id
        where member.id = :memberId and member.cooperative_id = :coopId
     `,
      {
        type: QueryTypes.SELECT,
        replacements: {
          memberId,
          coopId,
        },
      }
    );
    if (!results) {
      return json(
        { message: "Member not fond" },
        { status: StatusCodes.NOT_FOUND }
      );
    }
    const member = results?.[0] as MemberType;
    member.share = Number(member.share ?? 0);
    member.saving = Number(member.saving ?? 0);
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
