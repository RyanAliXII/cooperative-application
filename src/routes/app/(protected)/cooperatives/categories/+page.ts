import type { CooperativeCategory } from "$lib/definitions/types";
import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ fetch }) => {
  const fetchCategoriesResponse = await fetch("/api/cooperatives/categories");
  const { data } = await fetchCategoriesResponse.json();

  return {
    categories: (data?.categories ?? []) as CooperativeCategory[],
  };
};
