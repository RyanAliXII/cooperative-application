import type { Share as ShareType } from "$lib/definitions/types";
import { Share } from "$lib/models/model";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals }) => {
  const { session } = locals.session;

  const memberId = session.data.member.id;
  const shareModel = await Share.findAll({
    where: { memberId: memberId },
    order: [["created_at", "desc"]],
  });
  const shares = shareModel.map((saving) => saving.get({ plain: true }));
  return {
    shares: (shares ?? []) as ShareType[],
  };
};
