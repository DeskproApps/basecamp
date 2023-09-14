import { baseRequest } from "./baseRequest";
import type { IDeskproClient } from "@deskpro/app-sdk";
import type { Account, Project, Column } from "./types";

const getColumnService = (
  client: IDeskproClient,
  accountId: Account["id"],
  projectId: Project["id"],
  columnId: Column["id"],
) => {
  return baseRequest(client, {
    url: `/${accountId}/buckets/${projectId}/card_tables/columns/${columnId}`
  });
};

export { getColumnService };
