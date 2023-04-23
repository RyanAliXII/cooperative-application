import {
  Cooperative,
  CooperativeAccount,
  CooperativeStat,
  LiquidityLog,
  Loan,
  LoanRepayment,
  Member,
  Saving,
  SavingLog,
  Share,
  ShareLog,
} from "$lib/models/model";
import { error } from "@sveltejs/kit";
import { StatusCodes } from "http-status-codes";
import { validate } from "uuid";
import type { PageServerLoad } from "./$types";
import { CooperativeStatModel } from "$lib/models/cooperative_stats";
import type {
  CooperativeStats,
  ShareLog as ShareLogType,
  LiquidityLog as LiquidityLogType,
  SavingLog as SavingLogType,
  LoanRepayment as LoanRepaymentType,
  Share as ShareType,
  Saving as SavingType,
} from "$lib/definitions/types";

export const load: PageServerLoad = async ({ params }) => {
  const coopId = params.cooperativeId;
  const isIdValid = validate(coopId);
  if (!isIdValid) {
    throw error(StatusCodes.NOT_FOUND, { message: "Not Found" });
  }
  try {
    const coop = await Cooperative.findOne({
      where: {
        id: coopId,
      },
      include: [
        {
          required: true,
          model: CooperativeAccount,
          where: {
            isOwner: true,
          },
          as: "accounts",
        },
      ],
    });
    if (!coop) {
      throw error(StatusCodes.NOT_FOUND, { message: "Not Found" });
    }
    const accounts = coop?.dataValues?.accounts.map((a: any) => a?.dataValues);
    if (accounts.length === 0) {
      throw error(StatusCodes.NOT_FOUND, { message: "Not Found" });
    }
    delete coop?.dataValues?.accounts;

    const coopStatModel = await CooperativeStat.findOne({
      where: {
        cooperativeId: coopId,
      },
    });
    const savingsLogModel = await SavingLog.findAll({
      where: {
        cooperativeId: coopId,
      },
    });
    const liquidityLogModel = await LiquidityLog.findAll({
      where: {
        cooperativeId: coopId,
      },
    });
    const shareLogModel = await ShareLog.findAll({
      where: {
        cooperativeId: coopId,
      },
    });

    const repaymentModel = await LoanRepayment.findAll({
      order: [["created_at", "desc"]],

      include: [
        {
          required: true,
          model: Loan,
          where: {
            cooperativeId: coopId,
          },
          include: [
            {
              required: true,
              model: Member,
            },
          ],
        },
      ],
    });

    const sharesModel = await Share.findAll({
      order: [["created_at", "desc"]],
      where: {
        cooperativeId: coopId,
      },
      include: [
        {
          model: Member,
        },
      ],
    });
    const savingsModel = await Saving.findAll({
      order: [["created_at", "desc"]],
      where: {
        cooperativeId: coopId,
      },
      include: [
        {
          model: Member,
        },
      ],
    });

    if (
      !coopStatModel ||
      !shareLogModel ||
      !coopStatModel ||
      !liquidityLogModel ||
      !sharesModel ||
      !savingsModel ||
      !repaymentModel
    ) {
      throw error(StatusCodes.NOT_FOUND, { message: "Not Found" });
    }
    const coopStat = coopStatModel.get({ plain: true });

    return {
      cooperative: {
        ...coop?.dataValues,
        account: accounts[0],
      },
      stat: coopStat as CooperativeStats,
      shareLogs: shareLogModel.map((shareLog) =>
        shareLog.get({ plain: true })
      ) as ShareLogType[],
      savingLogs: savingsLogModel.map((savingLog) =>
        savingLog.get({ plain: true })
      ) as SavingLogType[],
      liquidityLogs: liquidityLogModel.map((liquidityLog) =>
        liquidityLog.get({ plain: true })
      ) as LiquidityLogType[],
      repayments: (repaymentModel.map((loanRepayment) =>
        loanRepayment.get({ plain: true })
      ) ?? []) as LoanRepaymentType[],
      sharesTransactions: (sharesModel.map((share) =>
        share.get({ plain: true })
      ) ?? []) as ShareType[],
      savingsTransactions: (savingsModel.map((saving) =>
        saving.get({ plain: true })
      ) ?? []) as SavingType[],
    };
  } catch (err) {
    console.log(err);
    return { status: StatusCodes.INTERNAL_SERVER_ERROR };
  }
};
