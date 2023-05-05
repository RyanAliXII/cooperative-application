import { Session } from "$lib/models/model";
import type { RequestEvent } from "@sveltejs/kit";

export type SessionMeta = {
  appType: "Member" | "Cooperative" | "Main" | null;
  error?: boolean;
  errorMsg?: string;
  session: SessionType;
};

export type SessionType = {
  sid: string;
  data: any;
  appType: "Main" | "Cooperative" | "Member" | null;
  expiresAt: string;
};
export enum AppTypes {
  Main = "Main",
  Cooperative = "Cooperative",
  Member = "Member",
}
export const getSessionMetadata = async ({
  request,
  cookies,
}: RequestEvent): Promise<SessionMeta> => {
  let sid;
  const requestorUrl = request.headers.get("Referer");
  const appUrl = new URL(requestorUrl ?? "https://www.facebook.com");
  sid = cookies.get("app_sid");
  if (!sid) {
    const sessionMeta: SessionMeta = {
      appType: null,
      error: true,
      errorMsg: "sid not found",
      session: {
        appType: null,
        sid: "",
        data: {},
        expiresAt: "",
      },
    };
    return sessionMeta;
  }
  const sessionModel = await Session.findOne({
    where: {
      sid: sid ?? "",
    },
  });

  if (!sessionModel) {
    const sessionMeta: SessionMeta = {
      appType: null,
      error: true,
      errorMsg: "session not found",
      session: {
        sid: "",
        data: {},
        expiresAt: "",
        appType: null,
      },
    };
    return sessionMeta;
  }

  const session: SessionType = sessionModel.get({ plain: true });
  const sessionMeta: SessionMeta = {
    appType: session.appType,
    session: session,
    error: false,
    errorMsg: "",
  };
  return sessionMeta;
};
