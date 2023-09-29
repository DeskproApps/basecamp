import { baseRequest } from "./baseRequest";
import type { IDeskproClient } from "@deskpro/app-sdk";
import type { Card, Account, Project } from "./types";

const updateCardService = (
  client: IDeskproClient,
  accountId: Account["id"],
  projectId: Project["id"],
  cardId: Card["id"],
  data: object,
) => {
  return baseRequest<Card>(client, {
    url: `/${accountId}/buckets/${projectId}/card_tables/cards/${cardId}`,
    method: "PUT",
    data,
  });
};

export { updateCardService };
