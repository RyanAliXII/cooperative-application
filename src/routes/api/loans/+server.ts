import { AddLoanSchemaValidation } from "$lib/definitions/schema";
import { LoanStatuses, type LoanStatus } from "$lib/internal/transaction";
import { Loan, Member } from "$lib/models/model";
import { json, type RequestHandler } from "@sveltejs/kit";
import { StatusCodes } from "http-status-codes";

export const POST: RequestHandler = async (event) => {
  const { request } = event;
  try {
    const { session } = event.locals.session;

    const body = await request.json();
    const coopId = session.data?.cooperative?.id;
    const parsedBody = await AddLoanSchemaValidation.validate(body);
    const interest = (parsedBody.interest / 100) * parsedBody.amount;
    const totalDue = parsedBody.amount + interest;

    await Loan.create({
      memberId: parsedBody.memberId,
      principal: parsedBody.amount,
      tenure: parsedBody.tenure,
      status: LoanStatuses.Requested,
      interest,
      remainingBalance: totalDue,
      cooperativeId: coopId,
      totalDue,
    });

    return json({ message: "Loan has been added." });
  } catch (error) {
    console.log(error);
    return json(
      { message: "Unknown error occured." },
      { status: StatusCodes.INTERNAL_SERVER_ERROR }
    );
  }
};

export const GET: RequestHandler = async ({ locals, url }) => {
  try {
    const { session } = locals.session;

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
    const loanModel = await Loan.findAll({
      where: {
        cooperativeId: session.data?.cooperative?.id,
        status: loanStatus,
      },
      include: [
        {
          model: Member,
        },
      ],
      order: [["created_at", "desc"]],
    });
    return json({
      message: "Loans has been fetched.",
      data: {
        loans: loanModel.map((l) => l.get({ plain: true })) ?? [],
      },
    });
  } catch (error) {
    console.log(error);
    return json(
      {
        message: "Unknown error occured",
        data: {
          loans: [],
        },
      },
      { status: StatusCodes.INTERNAL_SERVER_ERROR }
    );
  }
};
