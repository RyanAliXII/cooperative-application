import { StatusCodes } from "http-status-codes";
export const handle = async ({ event, resolve }) => {
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
      return new Response("Redirect", {
        status: StatusCodes.SEE_OTHER,
        headers: { Location: "/cooperative/login" },
      });
    }
  }

  if (
    event.url.pathname.startsWith("/app") &&
    event.url.pathname != "/app/login"
  ) {
    if (!appSID) {
      console.log("INVALID APP SID");
      return new Response("Redirect", {
        status: StatusCodes.SEE_OTHER,
        headers: {
          Location: "/app/login",
        },
      });
    }
  }
  const response = await resolve(event);
  return response;
};
