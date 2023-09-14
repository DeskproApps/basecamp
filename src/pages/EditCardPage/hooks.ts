import { useMemo } from "react";
import get from "lodash/get";
import { useQueryWithClient } from "@deskpro/app-sdk";
import { QueryKey } from "../../query";
import { getCardService, getColumnService } from "../../services/basecamp";
import type { CardMeta } from "../../types";
import type { Account, Card, Project, Column } from "../../services/basecamp/types";

export type Result = {
  isLoading: boolean;
  card: Card,
  column: Column,
};

type UseCard = (params?: Partial<CardMeta>) => Result;

const useCard: UseCard = (params) => {
  const accountId = get(params, "accountId");
  const projectId = get(params, "projectId");
  const cardId = get(params, "cardId");

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

  const columnId = useMemo(() => get(card.data, ["parent", "id"]), [card.data]);

  const column = useQueryWithClient(
    [QueryKey.TABLE_COLUMN, `${columnId as Column["id"]}`],
    (client) => getColumnService(
      client,
      accountId as Account["id"],
      projectId as Project["id"],
      columnId as Column["id"],
    ),
    { enabled: Boolean(accountId) && Boolean(projectId) && Boolean(columnId) },
  );

  return {
    isLoading: [card, column].some(({ isLoading }) => isLoading),
    card: get(card, ["data"]) as Card,
    column: get(column, ["data"]) as Column,
  };
};

export { useCard };
