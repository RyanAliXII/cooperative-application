import type { LayoutServerLoad } from "../$types";

export const load: LayoutServerLoad = async (event) => {
  const { session } = event.locals.session;
  return {
    cooperative: session.data.cooperative ?? {
      id: "",
      name: "",
    },
  };
};
