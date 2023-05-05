import type {
  CooperativeCategory,
  CooperativeCriteria,
} from "$lib/definitions/types";
import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ fetch }) => {
  const fetchCriteriasReponse = await fetch("/api/rewards/criterias");
  const { data } = await fetchCriteriasReponse.json();
  return {
    criterias: (data?.criterias ?? []) as CooperativeCriteria[],
  };
};
