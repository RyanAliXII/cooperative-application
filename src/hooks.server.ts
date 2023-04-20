import { AppTypes, getSessionMetadata } from "$lib/internal/session";
import { Cooperative, CooperativeStat, Session } from "$lib/models/model";
import type { Handle } from "@sveltejs/kit";
import { StatusCodes } from "http-status-codes";
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
          Location: "/cooperatives/login",
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
          Location: "/cooperatives/login",
        },
      });
    }
    if (sessionMeta.appType != AppTypes.Cooperative) {
      return new Response("Redirect", {
        status: StatusCodes.SEE_OTHER,
        headers: {
          Location: "/cooperatives/login",
        },
      });
    }
    event.locals.session = sessionMeta;
  }

  if (
    event.url.pathname.startsWith("/app") &&
    event.url.pathname != "/app/login"
  ) {
    const sessionMeta = await getSessionMetadata(event);
    if (sessionMeta.error) {
      return new Response("Redirect", {
        status: StatusCodes.SEE_OTHER,
        headers: {
          Location: "/app/login",
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
          Location: "/app/login",
        },
      });
    }
    if (sessionMeta.appType != AppTypes.Main) {
      return new Response("Redirect", {
        status: StatusCodes.SEE_OTHER,
        headers: {
          Location: "/app/login",
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
