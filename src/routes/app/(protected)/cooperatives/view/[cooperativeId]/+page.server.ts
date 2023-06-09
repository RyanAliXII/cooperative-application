import {
  Cooperative,
  CooperativeAccount,
  CooperativeCategory,
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

import type {
  CooperativeStats,
  ShareLog as ShareLogType,
  LiquidityLog as LiquidityLogType,
  SavingLog as SavingLogType,
  LoanRepayment as LoanRepaymentType,
  Share as ShareType,
  Saving as SavingType,
  Cooperative as CooperativeType,
  CooperativeCategory as CooperativeCategoryType,
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
    const categoryModel = await CooperativeCategory.findAll({
      order: [["created_at", "desc"]],
    });
    if (
      !coopStatModel ||
      !shareLogModel ||
      !coopStatModel ||
      !liquidityLogModel ||
      !sharesModel ||
      !savingsModel ||
      !repaymentModel ||
      !categoryModel
    ) {
      throw error(StatusCodes.NOT_FOUND, { message: "Not Found" });
    }
    const coopStat = coopStatModel.get({ plain: true });
    delete coop.dataValues["category_id"];
    return {
      cooperative: {
        ...coop?.dataValues,
        account: accounts[0],
      } as CooperativeType,
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

      categories: (categoryModel?.map((c) => c.get()) ??
        []) as CooperativeCategoryType[],
    };
  } catch (err) {
    console.log(err);
    return { status: StatusCodes.INTERNAL_SERVER_ERROR };
  }
};
