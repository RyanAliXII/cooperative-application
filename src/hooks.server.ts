import { getSessionMetadata } from "$lib/internal/session";
import { Session } from "$lib/models/model";
import type { Handle } from "@sveltejs/kit";
import { StatusCodes } from "http-status-codes";
import { json } from "sequelize";
export const handle: Handle = async ({ event, resolve }) => {
  /*
    app_sid set on cookies is session cookies.
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
      await Session.destroy({
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
    event.locals.session = sessionMeta;
  }
  //api session validation
  if (event.url.pathname.startsWith("/api")) {
    const sessionMeta = await getSessionMetadata(event);
    if (sessionMeta.error) {
      return new Response(JSON.stringify({ message: "Unauthorized" }), {
        status: StatusCodes.UNAUTHORIZED,
      });
    }
    const expiration = new Date(sessionMeta.session.expiresAt).getTime();
    if (new Date().getTime() > expiration) {
      event.cookies.delete("app_sid");
      await Session.destroy({
        where: {
          sid: sessionMeta.session.sid,
        },
      });
      return new Response(JSON.stringify({ message: "Unauthorized" }), {
        status: StatusCodes.UNAUTHORIZED,
      });
    }
    event.locals.session = sessionMeta;
  }
  const response = await resolve(event);
  return response;
};
