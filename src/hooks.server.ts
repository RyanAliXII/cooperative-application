import type { Handle } from "@sveltejs/kit";

import { CooperativeAccount } from "$lib/models/model";
export const handle: Handle = async ({ event, resolve }) => {
  const response = await resolve(event);

  return response;
};
