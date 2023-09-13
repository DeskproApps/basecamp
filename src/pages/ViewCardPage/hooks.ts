import { useMemo } from "react";
import get from "lodash/get";
import find from "lodash/find";
import { useQueryWithClient } from "@deskpro/app-sdk";
import {
  getCardService,
  getProjectService,
  getAuthInfoService,
  getCardCommentsService,
} from "../../services/basecamp";
import { QueryKey } from "../../query";
import type { CardMeta } from "../../types";
import type { Card, Project, Account, CardComment } from "../../services/basecamp/types";

export type Result = {
  isLoading: boolean;
  account: Account,
  project: Project,
  card: Card,
  comments: CardComment[],
};

type UseCard = (params?: Partial<CardMeta>) => Result;

const useCard: UseCard = (params) => {
  const accountId = get(params, "accountId");
  const projectId = get(params, "projectId");
  const cardId = get(params, "cardId");

  const authInfo = useQueryWithClient([QueryKey.ACCOUNTS], getAuthInfoService);

  const account = useMemo(() => {
    return find(get(authInfo.data, ["accounts"]), { id: Number(accountId) });
  }, [authInfo.data, accountId]);

  const project = useQueryWithClient(
    [QueryKey.PROJECT, `${projectId as Project["id"]}`],
    (client) => getProjectService(
      client,
      accountId as Account["id"],
      projectId as Project["id"],
    ),
    { enabled: Boolean(accountId) && Boolean(projectId) },
  );

  const card = useQueryWithClient(
    [QueryKey.CARD, `${cardId as Card["id"]}`],
    (client) => getCardService(
      client,
      accountId as Account["id"],
      projectId as Project["id"],
      cardId as Card["id"],
    ),
    { enabled: Boolean(accountId) && Boolean(projectId) && Boolean(cardId) },
  );

  const comments = useQueryWithClient(
    [QueryKey.CARD_COMMENTS, `${cardId as Card["id"]}` ],
    (client) => getCardCommentsService(
      client,
      accountId as Account["id"],
      projectId as Project["id"],
      cardId as Card["id"],
    ),
    { enabled: Boolean(accountId) && Boolean(projectId) && Boolean(cardId) },
  );

  return {
    isLoading: [card, authInfo, project, comments].some(({ isLoading }) => isLoading),
    card: get(card, ["data"]) as Card,
    account: account as Account,
    project: get(project, ["data"]) as Project,
    comments: get(comments, ["data"], []) || [],
  };
};

export { useCard };
