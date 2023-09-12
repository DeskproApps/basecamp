import { baseRequest } from "./baseRequest";
import type { IDeskproClient } from "@deskpro/app-sdk";
import type { Card, Account, Project, Column} from "./types";

const createCardService = (
  client: IDeskproClient,
  accountId: Account["id"],
  projectId: Project["id"],
  columnId: Column["id"],
  data: object,
) => {
  return baseRequest<Card>(client, {
    url: `/${accountId}/buckets/${projectId}/card_tables/lists/${columnId}/cards`,
    method: "POST",
    data,
  });
};

export { createCardService };
