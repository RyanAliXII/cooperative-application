import { EditLoanSchemaValidation } from "$lib/definitions/schema";
import { LoanStatuses } from "$lib/internal/transaction";
import { Loan, Member } from "$lib/models/model";
import { json, type RequestHandler } from "@sveltejs/kit";
import { StatusCodes } from "http-status-codes";

export const PUT: RequestHandler = async ({ request, locals }) => {
  try {
    const { session } = locals.session;
    const coopId = session.data?.cooperative?.id;
    const body = await request.json();

    const parsedBody = await EditLoanSchemaValidation.validate(body);
    const interest = (parsedBody.interest / 100) * parsedBody.amount;
    const totalDue = parsedBody.amount + interest;
    await Loan.update(
      {
        memberId: parsedBody.memberId,
        principal: parsedBody.amount,
        tenure: parsedBody.tenure,
        status: LoanStatuses.Requested,
        interest,
        remainingBalance: totalDue,
        totalDue,
      },
      {
        where: {
          cooperativeId: coopId,
          id: parsedBody.id,
        },
      }
    );
    return json({
      message: "Loan has been updated.",
    });
  } catch (error) {
    console.log(error);
    return json(
      {
        message: "Unknown error occured.",
      },
      {
        status: StatusCodes.INTERNAL_SERVER_ERROR,
      }
    );
  }
};

export const GET: RequestHandler = async ({ locals, params }) => {
  const { session } = locals.session;
  const coopId = session.data?.cooperative?.id;
  const loanId = params.loanId;
  const loanModel = await Loan.findOne({
    where: {
      id: loanId,
      cooperativeId: coopId,
    },
    include: [
      {
        model: Member,
      },
    ],
  });
  console.log(loanModel?.get({ plain: true }));
  return json({});
};

export const DELETE: RequestHandler = async ({ locals, params }) => {
  const { session } = locals.session;
  const coopId = session.data?.cooperative?.id;
  const loanId = params.loanId;
  try {
    await Loan.destroy({
      where: {
        id: loanId,
        cooperativeId: coopId,
      },
    });
    return json({ message: "Loan has been removed." });
  } catch (error) {
    console.log(error);
    return json({ message: "Uknown error occured" });
  }
};

export const PATCH: RequestHandler = async ({ locals, params, request }) => {
  const { session } = locals.session;
  const coopId = session.data?.cooperative?.id;
  const loanId = params.loanId;
  const body = await request.json();
  try {
    await Loan.update(body, {
      where: {
        id: loanId,
        cooperativeId: coopId,
      },
    });
    return json({ message: "Loan has been removed." });
  } catch (error) {
    console.log(error);
    return json({ message: "Uknown error occured" });
  }
};
