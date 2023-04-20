import { Loan, LoanRepayment, Member } from "$lib/models/model";
import { sequelize } from "$lib/models/sequelize";
import { json, type RequestHandler } from "@sveltejs/kit";
import type {
  LoanRepayment as LoanRepaymentType,
  Loan as LoanType,
} from "$lib/definitions/types";
import { StatusCodes } from "http-status-codes";
import { AddRepaymentModalSchemaValidation } from "$lib/definitions/schema";
import { LoanStatuses } from "$lib/internal/transaction";

export const POST: RequestHandler = async ({ request, locals }) => {
  const { session } = locals.session;
  const coopId = session.data?.cooperative?.id;
  const transaction = await sequelize.transaction();
  const body: {
    loanId: string;
    amount: number;
    remainingBalance: number;
    remarks: string;
  } = await request.json();
  try {
    await AddRepaymentModalSchemaValidation.validate(body);
    const loanModel = await Loan.findOne({
      where: {
        cooperativeId: coopId,
        id: body.loanId,
      },
      transaction,
    });
    if (!loanModel) {
      transaction.rollback();
      return json(
        {
          message: "Invalid loan id",
        },
        { status: StatusCodes.BAD_REQUEST }
      );
    }
    const loan = loanModel?.get({ plain: true }) as LoanType;
    if (loan.remainingBalance < body.amount) {
      return json(
        {
          message:
            "Invalid amount value. Values must be less than or equal remainin balance.",
        },
        { status: StatusCodes.BAD_REQUEST }
      );
    }

    const updatedLoanModel = await loanModel.decrement("remaining_balance", {
      by: body.amount,
      transaction,
    });
    if (!updatedLoanModel) {
      transaction.rollback();
      return json(
        {
          message: "Cannot update loan",
        },
        { status: StatusCodes.BAD_REQUEST }
      );
    }
    const updatedLoan: LoanType = updatedLoanModel.get({ plain: true });
    await LoanRepayment.create(
      {
        loanId: body.loanId,
        amountPaid: body.amount,
        remarks: body.remarks,
        balanceBeforeRepayment: loan.remainingBalance,
        remainingBalance: updatedLoan.remainingBalance,
      },
      { transaction }
    );
    if (updatedLoan.remainingBalance === 0) {
      await updatedLoanModel.update(
        { status: LoanStatuses.Finished },
        { transaction }
      );
    }
    transaction.commit();
    return json({ message: "Repayment has been added." });
  } catch (error) {
    transaction.rollback();
    console.log(error);
    return json(
      { message: "Unknown error occured." },
      { status: StatusCodes.INTERNAL_SERVER_ERROR }
    );
  }
};

export const GET: RequestHandler = async ({ request, locals }) => {
  const { session } = locals.session;
  const coopId = session.data?.cooperative?.id;

  try {
    const loanRepaymentModel = await LoanRepayment.findAll({
      include: {
        model: Loan,
        include: [
          {
            model: Member,
          },
        ],
        where: {
          cooperativeId: coopId,
        },
      },
    });

    if (!loanRepaymentModel) {
      return json(
        {
          message: "Repayments not found",
          data: {
            repayments: [],
          },
        },
        { status: StatusCodes.BAD_REQUEST }
      );
    }

    const repayments = loanRepaymentModel.map((e) =>
      e.get({ plain: true })
    ) as LoanRepaymentType[];
    return json({
      message: "Repayments has been fetched.",
      data: {
        repayments: repayments ?? [],
      },
    });
  } catch (error) {
    console.log(error);
    return json(
      {
        message: "Unknown error occured",
        data: {
          repayments: [],
        },
      },
      { status: StatusCodes.INTERNAL_SERVER_ERROR }
    );
  }
};
