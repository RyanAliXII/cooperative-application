import { getSessionMetadata } from "$lib/internal/session";
import { Session } from "$lib/models/model";
import { StatusCodes } from "http-status-codes";
export const handle = async ({ event, resolve }) => {
  /*
    app_sid set on cookies is session cookies
  
  */

  if (
    event.url.pathname.startsWith("/cooperatives") &&
    event.url.pathname != "/cooperatives/login" &&
    event.url.pathname != "/cooperatives/registration"
  ) {
    const sessionMeta = await getSessionMetadata(event);
    if (sessionMeta.error) {
      return new Response("Redirect", {
        status: StatusCodes.SEE_OTHER,
        headers: {
          Location: "/members/login",
        },
      });
    }
    const expiration = new Date(sessionMeta.session.expiresAt).getTime();
    if (new Date().getTime() > expiration) {
      event.cookies.delete("app_sid");
      Session.destroy({
        where: {
          sid: sessionMeta.session.sid,
        },
      });
      return new Response("Redirect", {
        status: StatusCodes.SEE_OTHER,
        headers: {
          Location: "/members/login",
        },
      });
    }
  }

  // if (
  //   event.url.pathname.startsWith("/app") &&
  //   event.url.pathname != "/app/login"
  // ) {

  // if (
  //   event.url.pathname.startsWith("/members") &&
  //   event.url.pathname != "/members/login"
  // ) {
  //   if (!memberSID) {
  //     console.log("INVALID MEMBER SID");
  //     return new Response("Redirect", {
  //       status: StatusCodes.SEE_OTHER,
  //       headers: {
  //         Location: "/members/login",
  //       },
  //     });
  //   }
  // }
  const response = await resolve(event);
  return response;
};
