import type { CooperativeCategory as CooperativeCategoryType } from "$lib/definitions/types";
import {
  Cooperative,
  CooperativeCategory,
  CooperativeCriteria,
  CooperativeRanking,
  CooperativeStat,
  CriteriaField,
  CriteriaFieldPoint,
} from "$lib/models/model";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ fetch }) => {
  try {
    const categories = await CooperativeCategory.findAll({
      include: [
        {
          model: Cooperative,
          as: "cooperatives",
          include: [
            {
              model: CooperativeStat,
              as: "stats",
            },
            {
              model: CooperativeRanking,
              as: "rank",
            },
          ],
        },
        {
          model: CriteriaFieldPoint,
          as: "criteriaFieldPoints",
        },
        {
          model: CooperativeCriteria,
          as: "criteria",
          include: [
            {
              model: CriteriaField,
              as: "criteriaFields",
            },
          ],
        },
      ],
    });

    return {
      categories: (categories.map((c) => {
        const category = c.get({ plain: true }) as CooperativeCategoryType;
        category.cooperatives =
          category.cooperatives?.sort((a, b) => {
            return (a.rank?.rankPosition ?? 0) - (b.rank?.rankPosition ?? 0);
          }) ?? [];
        return category;
      }) ?? []) as CooperativeCategoryType[],
    };
  } catch (er) {
    {
      return {
        categories: [],
      };
    }
  }
};
