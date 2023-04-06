import { json, type RequestHandler } from "@sveltejs/kit";
import { StatusCodes } from "http-status-codes";

import { Member } from "$lib/models/model";
import { EditMemberValidationSchema } from "$lib/definitions/schema";

export const PATCH: RequestHandler = async ({ request, params }) => {
  const memberId = params?.memberId;
  const accountId = params?.accountId;
  console.log(memberId);
  console.log(accountId);
  return json({});
};
