import { Session } from "$lib/models/model";
import { redirect, type Handle } from "@sveltejs/kit";
import { StatusCodes } from "http-status-codes";
export const handle: Handle = async ({ event, resolve }) => {
  const response = await resolve(event);
  const sid = event.cookies.get("coop_sid");
  if (
    event.url.pathname.startsWith("/cooperative") &&
    event.url.pathname != "/cooperative/login"
  ) {
    if (!sid) {
      console.log("INVALID COOPERATIVE SID");
      throw redirect(StatusCodes.SEE_OTHER, "/cooperative/login");
    }
  }

  return response;
};
