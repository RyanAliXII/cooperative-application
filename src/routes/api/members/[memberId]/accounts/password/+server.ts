import { Member, MemberAccount } from "$lib/models/model";
import { json, type RequestHandler } from "@sveltejs/kit";
import { hash } from "bcrypt";
import { generate } from "generate-password";
import { StatusCodes } from "http-status-codes";

export const PATCH: RequestHandler = async ({ params, locals }) => {
  const memberId = params?.memberId;
  const { session } = locals.session;
  const cooperativeId = session.data?.cooperativeId;
  try {
    const memberAccount = await MemberAccount.findOne({
      where: {
        memberId,
      },
      include: [
        {
          required: true,
          model: Member,
          where: {
            cooperativeId,
          },
        },
      ],
    });

    if (!memberAccount) {
      return json(
        { message: "Account not found." },
        { status: StatusCodes.NOT_FOUND }
      );
    }
    const newPassword = generate({ strict: true });
    const newHashedPassword = await hash(newPassword, 5);
    await memberAccount.update({ password: newHashedPassword });
    return json({
      message: "Account password has been updated.",
      data: {
        account: {
          password: newPassword,
        },
      },
    });
  } catch (error) {
    console.log(error);
    return json(
      { message: "Unknown error occured." },
      { status: StatusCodes.INTERNAL_SERVER_ERROR }
    );
  }
};
