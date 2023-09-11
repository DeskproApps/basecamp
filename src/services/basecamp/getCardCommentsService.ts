import { baseRequest } from "./baseRequest";
import type { IDeskproClient } from "@deskpro/app-sdk";
import type { CardComment, Card, Account, Project } from "./types";

const getCardCommentsService = (
  client: IDeskproClient,
  accountId: Account["id"],
  projectId: Project["id"],
  cardId: Card["id"],
) => {
  return baseRequest<CardComment[]>(client, {
    url: `/${accountId}/buckets/${projectId}/recordings/${cardId}/comments.json`,
  });
};

export { getCardCommentsService };
