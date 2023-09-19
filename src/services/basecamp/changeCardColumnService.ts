import { baseRequest } from "./baseRequest";
import type { IDeskproClient } from "@deskpro/app-sdk";
import type { Account, Project, Column } from "./types";

const changeCardColumnService = (
  client: IDeskproClient,
  accountId: Account["id"],
  projectId: Project["id"],
  cardId: Column["id"],
  columnId: Column["id"],
) => {
  return baseRequest(client, {
    url: `/${accountId}/buckets/${projectId}/card_tables/cards/${cardId}/moves`,
    method: "POST",
    data: { column_id: columnId },
  });
};

export { changeCardColumnService };
