import { Session } from "$lib/models/model";
import { redirect, type Handle } from "@sveltejs/kit";
import { StatusCodes } from "http-status-codes";
export const handle: Handle = async ({ event, resolve }) => {
  const response = await resolve(event);

  /*
    app_sid set on cookies are meant for session of CCDCO application
    coop_sid set on cookies are meant for cooperative's application
    member_sid set on cookies are meant for member's application
  */
  const coopSID = event.cookies.get("coop_sid");
  const appSID = event.cookies.get("app_sid");
  if (
    event.url.pathname.startsWith("/cooperative") &&
    event.url.pathname != "/cooperative/login"
  ) {
    if (!coopSID) {
      console.log("INVALID COOPERATIVE SID");
      throw redirect(StatusCodes.SEE_OTHER, "/cooperative/login");
    }
  }

  if (
    event.url.pathname.startsWith("/app") &&
    event.url.pathname != "/app/login"
  ) {
    if (!appSID) {
      console.log("INVALID APP SID");
      throw redirect(StatusCodes.SEE_OTHER, "/app/login");
    }
  }

  return response;
};
