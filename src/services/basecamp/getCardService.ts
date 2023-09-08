import { baseRequest } from "./baseRequest";
import type { IDeskproClient } from "@deskpro/app-sdk";
import type { Card, Account, Project } from "./types";

import { mockCard } from "../../../testing";

const getCardService = (
  client: IDeskproClient,
  accountId: Account["id"],
  projectId: Project["id"],
  cardId: Card["id"],
) => {
  return Promise.resolve(mockCard);
  return baseRequest<Card>(client, {
    url: `/${accountId}/buckets/${projectId}/card_tables/cards/${cardId}`,
  });
};

export { getCardService };
