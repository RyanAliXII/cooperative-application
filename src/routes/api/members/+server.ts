import { json, type RequestHandler } from "@sveltejs/kit";
import { StatusCodes } from "http-status-codes";
import { Member, MemberAccount, Session } from "$lib/models/model";
import type { Member as MemberType } from "$lib/definitions/types";
import { NewMemberValidationSchema } from "$lib/definitions/schema";
import { sequelize } from "$lib/models/sequelize";
import generator from "generate-password";
import { hash } from "bcrypt";
import { Op, QueryTypes } from "sequelize";

export const POST: RequestHandler = async ({ request, locals }) => {
  const transaction = await sequelize.transaction();
  try {
    const { session } = locals.session;
    //data from session
    const coopId = session.data?.cooperative?.id;
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

export const GET: RequestHandler = async ({ request, cookies, locals }) => {
  try {
    const { session } = locals.session;
    //data from session
    const coopId = session.data?.cooperative?.id;
    const queryParams = new URL(request.url).searchParams;
    const query = queryParams.get("q");
    /* check if url has param "q" short for "query"
       if there is a q url param, it means the endpoint will be returning result based on keyword.
    */
    if (query) {
      if (query.length > 0) {
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
          where search_vector @@ (plainto_tsquery('simple', :query) :: text || ':*' ) :: tsquery AND cooperative_id = :coopId
          AND approved_at is not null AND exited_at is null
          ORDER BY (ts_rank(search_vector, (plainto_tsquery('simple', :query) :: text || ':*' ) :: tsquery ) 
          )  DESC
         
        `,
          {
            type: QueryTypes.SELECT,
            replacements: {
              query,
              coopId,
            },
          }
        );
        return json({
          message: "Members has been fetched.",
          data: {
            members:
              results.map((m) => {
                const member = m as MemberType;

                return member;
              }) ?? [],
          },
        });
      }
    }
    const memberModel = await Member.findAll({
      where: {
        cooperativeId: coopId,
        approvedAt: {
          [Op.not]: null,
        },
        exitedAt: null,
      },
    });
    return json(
      {
        message: "Members has been fetched.",
        data: {
          members: memberModel.map((m) => m.get({ plain: true })) ?? [],
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
