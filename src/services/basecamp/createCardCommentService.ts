import { baseRequest } from "./baseRequest";
import type { IDeskproClient } from "@deskpro/app-sdk";
import type { Card, Account, Project, CardComment } from "./types";

const createCardCommentService = (
  client: IDeskproClient,
  accountId: Account["id"],
  projectId: Project["id"],
  cardId: Card["id"],
  data: { content: CardComment["content"] },
) => {
  return baseRequest<CardComment>(client, {
    url: `/${accountId}/buckets/${projectId}/recordings/${cardId}/comments`,
    method: "POST",
    data,
  });
};

export { createCardCommentService };
