import { LoanStatuses } from "$lib/internal/transaction";
import { sequelize } from "$lib/models/sequelize";
import { json, type RequestHandler } from "@sveltejs/kit";
import { StatusCodes } from "http-status-codes";

export const GET: RequestHandler = async ({ locals, url }) => {
  const { session } = locals.session;
  const coopId = session.data?.cooperative?.id;
  const loanStatus = url.searchParams.get("status");

  if (!loanStatus) {
    return json(
      {
        message: "Invalid loan status.",
        data: {
          loans: [],
        },
      },
      { status: StatusCodes.BAD_REQUEST }
    );
  }
  if (!Object.values(LoanStatuses).includes(loanStatus as LoanStatuses)) {
    return json(
      {
        message: "Invalid loan status.",
        data: {
          loans: [],
        },
      },
      { status: StatusCodes.BAD_REQUEST }
    );
  }

  try {
    const [result, _] = await sequelize.query(
      "SELECT COALESCE(SUM(principal), 0) as principal, COALESCE(SUM(interest), 0) as interest  FROM loan inner join member on member_id = member.id where loan.cooperative_id = :coopId AND loan.status = :status GROUP BY loan.cooperative_id ",
      {
        replacements: {
          coopId,
          status: loanStatus,
        },
      }
    );
    const total = result?.[0] as { principal: number; interest: number };

    return json({
      data: {
        loans: { total: total ?? { principal: 0, interest: 0 } },
      },
    });
  } catch (error) {
    console.log(error);
    return json(
      {
        message: "Unknown error occured",
        data: {
          loans: { total: { principal: 0, interest: 0 } },
        },
      },
      { status: StatusCodes.INTERNAL_SERVER_ERROR }
    );
  }
};
