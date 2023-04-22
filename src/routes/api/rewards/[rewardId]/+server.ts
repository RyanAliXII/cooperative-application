import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const PUT: RequestHandler = async ({ params }) => {
  const rewardId = params?.rewardId;
  return json({});
};
