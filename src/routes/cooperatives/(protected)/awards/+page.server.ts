import type { Recognition as RecognitionType } from "$lib/definitions/types";
import { Cooperative, Recognition, Reward } from "$lib/models/model";
import { RecognitionModel } from "$lib/models/recognition";
import type { PageServerLoad } from "./$types";
export const load: PageServerLoad = async ({ locals }) => {
  const { session } = locals.session;
  const cooperativeId = session.data?.cooperative.id;
  const recognitionModel = await Recognition.findAll({
    where: { cooperativeId },
    include: [
      {
        model: Reward,
      },
      {
        model: Cooperative,
      },
    ],
  });

  return {
    recognitions: recognitionModel.map(
      (recognition) => recognition.get({ plain: true }) ?? []
    ) as RecognitionType[],
  };
};
