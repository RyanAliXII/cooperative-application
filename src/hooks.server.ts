import { StatusCodes } from "http-status-codes";
export const handle = async ({ event, resolve }) => {
  /*
    app_sid set on cookies are meant for session of CCDCO application
    coop_sid set on cookies are meant for cooperative's application
    member_sid set on cookies are meant for member's application
  */
  const coopSID = event.cookies.get("coop_sid");
  const appSID = event.cookies.get("app_sid");
  const memberSID = event.cookies.get("member_sid");
  if (
    event.url.pathname.startsWith("/cooperatives") &&
    event.url.pathname != "/cooperatives/login" &&
    !event.url.pathname.startsWith("/cooperatives/registration")
  ) {
    if (!coopSID) {
      return new Response("Redirect", {
        status: StatusCodes.SEE_OTHER,
        headers: { Location: "/cooperatives/login" },
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

  if (
    event.url.pathname.startsWith("/members") &&
    event.url.pathname != "/members/login"
  ) {
    if (!memberSID) {
      console.log("INVALID MEMBER SID");
      return new Response("Redirect", {
        status: StatusCodes.SEE_OTHER,
        headers: {
          Location: "/members/login",
        },
      });
    }
  }
  const response = await resolve(event);
  return response;
};
