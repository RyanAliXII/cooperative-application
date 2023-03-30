/** @type {import('./$types').LayoutServerLoad} */
import { redirect } from "@sveltejs/kit";
import { StatusCodes } from "http-status-codes";
export async function load({ cookies }) {
  const sid = cookies.get("coop_sid");
  if (!sid) {
    throw redirect(StatusCodes.SEE_OTHER, "/cooperative/login");
  }
}
