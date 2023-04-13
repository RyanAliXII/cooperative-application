import { json } from "@sveltejs/kit";
import type { RequestHandler } from "@sveltejs/kit";
import type {
  MemberShare as MemberShareType,
  Share as ShareType,
} from "$lib/definitions/types";
import { sequelize } from "$lib/models/sequelize";
import { Share, MemberShare } from "$lib/models/model";
import { StatusCodes } from "http-status-codes";
import { EditSharesSchemaValidation } from "$lib/definitions/schema";

export const PUT: RequestHandler = async ({ request, params }) => {
  const shareId = params.shareId;
  const body: ShareType = await request.json();
  const transaction = await sequelize.transaction();
  try {
    const parsedBody = await EditSharesSchemaValidation.validate(body);
    const memberShareModel = await MemberShare.findOne({
      where: {
        memberId: parsedBody.memberId,
      },
      transaction,
    });

    const shareModel = await Share.findOne({
      where: {
        id: shareId,
      },
      transaction,
    });

    const memberShare: MemberShareType = memberShareModel?.get({ plain: true });
    const share: ShareType = shareModel?.get({ plain: true });

    if (!share || !memberShare || !shareModel || !memberShareModel) {
      transaction.rollback();
      return json(
        { message: "Invalid body and id params." },
        { status: StatusCodes.BAD_REQUEST }
      );
    }
    const incrementOrDecrementValue = share.amount - parsedBody.amount;
    if (share.amount > parsedBody.amount) {
      memberShareModel.decrement("total", {
        by: incrementOrDecrementValue,
        transaction,
      });
    } else {
      memberShareModel.increment("total", {
        by: incrementOrDecrementValue,
        transaction,
      });
    }

    await shareModel.update({
      remarks: parsedBody.remarks,
      amount: parsedBody.amount,
      memberId: parsedBody.memberId,
    });
    await transaction.commit();
    return json({ message: "Shares log has been updated." });
  } catch (error) {
    await transaction.rollback();
    console.log(error);
    return json(
      { message: "Unknown error occured." },
      { status: StatusCodes.INTERNAL_SERVER_ERROR }
    );
  }
};

export const DELETE: RequestHandler = async (event) => {
  const { params } = event;

  const shareId = params.shareId;
  const transaction = await sequelize.transaction();
  try {
    const shareModel = await Share.findOne({
      where: {
        id: shareId,
      },
      transaction,
    });
    const share: ShareType = shareModel?.get({ plain: true });
    const memberShareModel = await MemberShare.findOne({
      where: {
        memberId: share.memberId,
      },
      transaction,
    });
    const memberShare: MemberShareType = memberShareModel?.get({ plain: true });
    if (!memberShare || !share || !shareModel || !memberShareModel) {
      transaction.rollback();
      return json(
        { message: "Invalid body and id params." },
        { status: StatusCodes.BAD_REQUEST }
      );
    }
    await memberShareModel.decrement("total", {
      by: share.amount,
      transaction,
    });
    await shareModel.destroy({ transaction });
    await transaction.commit();
    return json({ message: "Shares has been deleted." });
  } catch (error) {
    console.log(error);
    transaction.rollback();
    return json(
      { message: "Unknown error occured." },
      { status: StatusCodes.INTERNAL_SERVER_ERROR }
    );
  }
};
