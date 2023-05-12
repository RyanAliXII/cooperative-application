import type { MemberStats as MemberStatsType } from "$lib/definitions/types";
import { MemberStatModel } from "$lib/models/member_stats";
import { MemberStat } from "$lib/models/model";
import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async ({ locals }) => {
  const { session } = locals.session;
  const memberId = session.data?.member?.id;
  const memberStatModel = await MemberStat.findOne({
    where: { memberId },
  });
  const stats = memberStatModel?.get({ plain: true });
  return {
    sessionData: session.data,
    memberStats: stats as MemberStatsType,
  };
};
