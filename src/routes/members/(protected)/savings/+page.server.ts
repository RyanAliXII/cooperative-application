import type { Saving as SavingType } from "$lib/definitions/types";
import { Saving } from "$lib/models/model";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals }) => {
  const { session } = locals.session;

  const memberId = session.data.member.id;
  const savingModel = await Saving.findAll({
    where: { memberId: memberId },
    order: [["created_at", "desc"]],
  });
  const savings = savingModel.map((saving) => saving.get({ plain: true }));
  return {
    savings: (savings ?? []) as SavingType[],
  };
};
