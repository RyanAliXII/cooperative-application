import { sequelize } from "$lib/models/sequelize";
import { json, type RequestHandler } from "@sveltejs/kit";
import { StatusCodes } from "http-status-codes";
import { hash } from "bcrypt";
import generator from "generate-password";
import { Cooperative, CooperativeAccount } from "$lib/models/model";
import { QueryTypes } from "sequelize";
import { CooperativeModel } from "$lib/models/cooperative";
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
      isOwner: true,
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

export const GET: RequestHandler = async ({ request, params, url }) => {
  try {
    const query = url.searchParams.get("q");
    if (query) {
      if (query.length > 0) {
        const results = await sequelize.query(
          `
          SELECT id, name, registration_number 
          as "registrationNumber", 
          initials, address, created_at as 
          "createdAt", updated_at as "updatedAt"  FROM cooperative
          where search_vector @@ (plainto_tsquery('simple', :query) :: text || ':*' ) :: tsquery 
          ORDER BY (ts_rank(search_vector, (plainto_tsquery('simple', :query) :: text || ':*' ) :: tsquery ) 
          )  DESC
         
        `,
          {
            type: QueryTypes.SELECT,
            replacements: {
              query,
            },
          }
        );

        return json({
          message: "Cooperatives found.",
          data: { cooperatives: results },
        });
      }
    }

    const cooperativeModel = await CooperativeModel.findAll({
      order: [["created_at", "DESC"]],
    });
    return json(
      {
        message: "Cooperative fetched successfully.",
        data: {
          cooperatives:
            cooperativeModel?.map((c) => c.get({ plain: true })) ?? [],
        },
      },
      { status: StatusCodes.OK }
    );
  } catch (error) {
    return json(
      { message: "Unknown error occured.", data: null },
      { status: StatusCodes.INTERNAL_SERVER_ERROR }
    );
  }
};
