import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { StatusCodes } from "http-status-codes";
import {
  Cooperative,
  CooperativeStat,
  SelectedCooperative,
} from "$lib/models/model";
import { SelectedCooperativeModel } from "$lib/models/selected_cooperative";
import type { Cooperative as CooperativeType } from "$lib/definitions/types";

export const POST: RequestHandler = async ({ request }) => {
  try {
    const body = await request.json();
    await SelectedCooperative.create(body);
    return json({ message: "Cooperative has been added." });
  } catch (error) {
    console.log(error);
    return json({}, { status: StatusCodes.INTERNAL_SERVER_ERROR });
  }
};

export const GET: RequestHandler = async () => {
  try {
    const selectedCooperativeModel = await SelectedCooperativeModel.findAll({
      include: [
        {
          model: Cooperative,
          include: [
            {
              as: "stats",
              model: CooperativeStat,
            },
          ],
        },
      ],
    });
    return json({
      data: {
        cooperatives:
          selectedCooperativeModel.map((sc) => {
            const coop = sc.get({ plain: true });
            return coop?.cooperative;
          }) ?? [],
      },
    });
  } catch (error) {
    console.log(error);
    return json(
      { message: [], data: { cooperatives: [] } },
      { status: StatusCodes.INTERNAL_SERVER_ERROR }
    );
  }
};
