import { getSessionMetadata } from "$lib/internal/session";
import { Session } from "$lib/models/model.js";
import { error } from "@sveltejs/kit";
import type { LayoutServerLoad } from "../$types";
import { StatusCodes } from "http-status-codes";

export const load: LayoutServerLoad = async (event) => {
  const { cookies } = event;
  const { session } = await getSessionMetadata(event);

  return {
    cooperative: session.data?.cooperative ?? {
      id: "",
      name: "",
    },
  };
};
