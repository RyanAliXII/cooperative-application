import type { ShareLog } from "$lib/definitions/types";
import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ fetch }) => {
  const response = await fetch("/api/shares/logs");
  const { data } = await response.json();
  return {
    shares: {
      logs: (data?.logs ?? []) as ShareLog[],
    },
  };
};
