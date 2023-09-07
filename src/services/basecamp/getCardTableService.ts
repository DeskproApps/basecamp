import { baseRequest } from "./baseRequest";
import type { IDeskproClient } from "@deskpro/app-sdk";
import type { Account, Project, Dock, CardTable } from "./types";

const getCardTableService = (
  client: IDeskproClient,
  accountId: Account["id"],
  projectId: Project["id"],
  tableId: Dock["id"],
) => {
  return baseRequest<CardTable>(client, {
    url: `/${accountId}/buckets/${projectId}/card_tables/${tableId}`
  });
};

export { getCardTableService };
