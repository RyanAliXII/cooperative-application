import type {
  CooperativeCategory,
  CooperativeCriteria,
} from "$lib/definitions/types";
import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ fetch }) => {
  const fetchCategoriesResponse = await fetch("/api/cooperatives/categories");
  const { data } = await fetchCategoriesResponse.json();
  const fetchCriteriasReponse = await fetch("/api/rewards/criterias");
  const { data: criteriaData } = await fetchCriteriasReponse.json();
  return {
    categories: (data?.categories ?? []) as CooperativeCategory[],
    criterias: (criteriaData?.criterias ?? []) as CooperativeCriteria[],
  };
};
