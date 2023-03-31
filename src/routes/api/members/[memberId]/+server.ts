import { json, type RequestHandler } from "@sveltejs/kit";
import { StatusCodes } from "http-status-codes";

import { Member } from "$lib/models/model";
import { EditMemberValidationSchema } from "$lib/definitions/schema";

export const PUT: RequestHandler = async ({ request, params }) => {
  const memberId = params?.memberId;
  if (!memberId) {
    return json({ message: "Invalid id" }, { status: StatusCodes.BAD_REQUEST });
  }
  try {
    const body = await request.json();
    const data = await EditMemberValidationSchema.validate(body);
    await Member.update(data, {
      where: {
        id: memberId,
      },
    });
    return json(
      { message: "Member has been updated." },
      { status: StatusCodes.OK }
    );
  } catch (error) {
    console.error(error);
    return json(
      { message: "Unknown error occured." },
      { status: StatusCodes.INTERNAL_SERVER_ERROR }
    );
  }
};
