import type { Cooperative, CooperativeAccount } from "$lib/definitions/types";
import { Session } from "$lib/models/model";
import type { RequestEvent } from "@sveltejs/kit";

type CooperativeSession = {
  sid: string;
  data: CooperativeSessionData;
};

interface CooperativeSessionData extends CooperativeAccount {
  cooperative: Cooperative;
}
export const getSessionMetadata = async (
  { request, url, cookies }: RequestEvent,
  requestOrigin: "cooperative" | "member" | "main" | undefined = undefined
) => {
  /* 
    It is necessary to know where the request comes from to know which session data from db to fetch.
    There are 3 types of sid set in cookies upon successful login, member_sid is for member portal, coop_sid is for cooperative portal and app_sid for CCDCO
    You can provide requestOrigin or automatically determine the requestOrigin by checking Referer Header. 
  */
  let sid;
  const requestorUrl = request.headers.get("Referer");
  const appUrl = new URL(requestorUrl ?? "");

  /*Providing request origin is mandatory if this function is called on +page.server since referrer header doesn't exist on page load.
  Using referer to know where the request comes from is useful for API since AJAX calls have referer header.*/

  if (
    requestOrigin === "cooperative" ||
    appUrl.pathname.startsWith("/cooperatives")
  ) {
    sid = cookies.get("coop_sid");
  }
  if (requestOrigin === "member" || appUrl.pathname.startsWith("/members")) {
    sid = cookies.get("member_sid");
  }
  if (requestOrigin === "main" || appUrl.pathname.startsWith("/app")) {
    sid = cookies.get("app_sid");
  }

  const SessionModel = await Session.findOne({
    where: {
      sid: sid ?? "",
    },
  });
  return SessionModel?.get({ plain: true });
};
