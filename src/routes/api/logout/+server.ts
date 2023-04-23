import { Session } from "$lib/models/model";
import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const DELETE: RequestHandler = async ({ locals, cookies }) => {
  const { session } = locals.session;
  await Session.destroy({
    where: {
      sid: session.sid,
    },
  });
  cookies.delete("app_sid");
  return json({ message: "Logged out successfully" });
};
