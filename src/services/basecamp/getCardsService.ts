import { baseRequest } from "./baseRequest";
import type { IDeskproClient } from "@deskpro/app-sdk";
import type { Account, Project, Column, Card } from "./types";

const getCardsService = (
  client: IDeskproClient,
  accountId: Account["id"],
  projectId: Project["id"],
  columnId: Column["id"],
) => {
  return baseRequest<Card[]>(client, {
    url: `/${accountId}/buckets/${projectId}/card_tables/lists/${columnId}/cards`
  });
};

export { getCardsService };
