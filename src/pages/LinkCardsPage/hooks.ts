import { useMemo } from "react";
import get from "lodash/get";
import find from "lodash/find";
import flatten from "lodash/flatten";
import { useQueryWithClient } from "@deskpro/app-sdk";
import { QueryKey } from "../../query";
import { useQueriesWithClient } from "../../hooks";
import {
  getCardsService,
  getAuthInfoService,
  getProjectsService,
  getCardTableService,
} from "../../services/basecamp";
import { getCardTables } from "../../utils";
import type { Maybe, CardTableTree } from "../../types";
import type { Account, CardTable, Project, Card, Column } from "../../services/basecamp/types";
import size from "lodash/size";

export type Result = {
  isLoading: boolean,
  accounts: Account[],
  cardTables: CardTableTree,
  cards: Card[],
  projects: Project[],
};

const useSearchCards = (
  accountId: Maybe<Account["id"]>,
  cardTableId: Maybe<CardTable["id"]>,
): Result => {
  const accounts = useQueryWithClient([QueryKey.ACCOUNTS], getAuthInfoService);

  const projects = useQueryWithClient(
    [QueryKey.PROJECTS, `${accountId}`],
    (client) => getProjectsService(client, accountId as Account["id"]),
    { enabled: Boolean(accountId) },
  );

  const projectId: Maybe<Project["id"]> = useMemo(() => {
    const project = find(projects.data, ({ dock }: Project) => {
      return dock.some(({ id }) => id === cardTableId);
    });

    return get(project, ["id"], null) || null;
  }, [projects, cardTableId]);

  const table = useQueryWithClient(
    [QueryKey.TABLE, `${cardTableId}`],
    (client) => getCardTableService(
      client,
      accountId as Account["id"],
      projectId as Project["id"],
      cardTableId as CardTable["id"],
    ),
    { enabled: Boolean(accountId) && Boolean(projectId) && Boolean(cardTableId) },
  );

  const columns: Column[] = useMemo(() => {
    return get(table, ["data", "lists"], []) || [];
  }, [table]);

  const cards = useQueriesWithClient(columns.map((column) => ({
    queryKey: [QueryKey.CARDS, `${column.id}`],
    queryFn: (client) => getCardsService(
      client,
      accountId as Account["id"],
      projectId as Project["id"],
      column.id,
    ),
    enabled: Boolean(size(columns)) && Boolean(accountId) && Boolean(projectId),
  })));

  return {
    isLoading: [...cards].some(({ isLoading }) => isLoading),
    projects: get(projects, ["data"], []) || [],
    accounts: get(accounts, ["data", "accounts"], []) || [],
    cardTables: getCardTables(get(projects, ["data"])),
    cards: flatten(cards.map(({ data }) => data).filter(Boolean)) as Card[],
  };
};

export { useSearchCards };
