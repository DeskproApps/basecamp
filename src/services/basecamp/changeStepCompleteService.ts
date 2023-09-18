import { baseRequest } from "./baseRequest";
import type { IDeskproClient } from "@deskpro/app-sdk";
import type { Account, Project, CardStep } from "./types";

const changeStepCompleteService = (
  client: IDeskproClient,
  accountId: Account["id"],
  projectId: Project["id"],
  stepId: CardStep["id"],
  complete: boolean,
) => {
  return baseRequest<CardStep>(client, {
    url: `/${accountId}/buckets/${projectId}/card_tables/steps/${stepId}/completions.json`,
    method: "PUT",
    data: { completion: complete ? "on" : "off" },
  });
};

export { changeStepCompleteService };
