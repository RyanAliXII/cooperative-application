import { getSessionMetadata } from "$lib/internal/session";

import { redirect } from "@sveltejs/kit";
import type { LayoutServerLoad } from "../$types";
import { StatusCodes } from "http-status-codes";

export const load: LayoutServerLoad = async (event) => {
  const { session } = event.locals.session;
  return {
    cooperative: session.data.cooperative ?? {
      id: "",
      name: "",
    },
  };
};
