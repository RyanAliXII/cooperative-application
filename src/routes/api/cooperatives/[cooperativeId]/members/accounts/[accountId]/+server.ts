import { json, type RequestHandler } from "@sveltejs/kit";

export const PATCH: RequestHandler = async ({ request, params }) => {
  const coopId = params?.cooperativeId;
  const memberId = params?.memberId;
  const accountId = params?.accountId;
  const body = await request.json();
  console.log(coopId);
  console.log(body);
  console.log(accountId);
  return json({});
};
