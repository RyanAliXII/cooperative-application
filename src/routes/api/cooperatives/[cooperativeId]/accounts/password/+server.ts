import { json, type RequestHandler } from "@sveltejs/kit";
import { StatusCodes } from "http-status-codes";
import { hash } from "bcrypt";
import generator from "generate-password";
import { CooperativeAccount } from "$lib/models/model";
import { validate } from "uuid";
export const PATCH: RequestHandler = async ({ request, params }) => {
  const id = params?.cooperativeId;
  if (!validate(id ?? "")) {
    console.log("Invalid id");
    return json(
      {
        message: "Invalid id.",
        data: null,
      },
      { status: StatusCodes.BAD_REQUEST }
    );
  }
  try {
    const password = generator.generate({ strict: true });
    const hashedPassword = await hash(password, 5);
    await CooperativeAccount.update(
      {
        password: hashedPassword,
      },
      {
        where: {
          cooperativeId: id,
          isOwner: true,
        },
      }
    );
    return json(
      {
        message: "Coop created.",
        data: {
          account: {
            password: password,
          },
        },
      },
      { status: StatusCodes.OK }
    );
  } catch (error) {
    console.error(error);
    return json(
      { message: "Unknown error occured.", data: null },
      { status: StatusCodes.INTERNAL_SERVER_ERROR }
    );
  }
};
