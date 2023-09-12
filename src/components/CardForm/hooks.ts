import { useMemo } from "react";
import get from "lodash/get";
import { useQueryWithClient } from "@deskpro/app-sdk";
import {
  getAuthInfoService,
  getProjectsService,
  getCardTableService,
  getProjectPeopleService,
} from "../../services/basecamp";
import {
  getOptions,
  getPeopleOptions,
  getCardTableOptions,
} from "./utils";
import { QueryKey } from "../../query";
import type { Option } from "../../types";
import type {
  Column,
  Person,
  Account,
  Project,
  CardTable,
} from "../../services/basecamp/types";

type Params = {
  accountId?: Account["id"],
  projectId?: Project["id"],
  cardTableId?: CardTable["id"],
};

type UseFormDeps = (params?: Params) => {
  isLoading: boolean,
  accountOptions: Array<Option<Account["id"]>>,
  projectOptions: Array<Option<Project["id"]>>,
  cardTableOptions: Array<Option<CardTable["id"]>>,
  columnOptions: Array<Option<Column["id"]>>,
  peopleOptions: Array<Option<Person["id"]>>,
};

const useFormDeps: UseFormDeps = ({
  accountId,
  projectId,
  cardTableId,
} = {}) => {
  const accounts = useQueryWithClient([QueryKey.ACCOUNTS], getAuthInfoService);

  const projects = useQueryWithClient(
    [QueryKey.PROJECTS, `${accountId}`],
    (client) => getProjectsService(client, accountId as Account["id"]),
    { enabled: Boolean(accountId) },
  );

  const columns = useQueryWithClient(
    [QueryKey.CARD_TABLES, `${cardTableId}`],
    (client) => getCardTableService(
      client,
      accountId as Account["id"],
      projectId as Project["id"],
      cardTableId as CardTable["id"],
    ),
    { enabled: Boolean(accountId) && Boolean(projectId) && Boolean(cardTableId) },
  );

  const people = useQueryWithClient(
    [QueryKey.PEOPLE_BY_PROJECT, `${projectId}`],
    (client) => getProjectPeopleService(
      client,
      accountId as Account["id"],
      projectId as Project["id"],
      ),
    { enabled: Boolean(accountId) && Boolean(projectId) },
  );

  return {
    isLoading: [accounts].some(({ isLoading }) => isLoading),
    accountOptions: useMemo(() => getOptions<Account>(get(accounts, ["data", "accounts"])), [accounts]),
    projectOptions: useMemo(() => getOptions<Project>(get(projects, ["data"])), [projects]),
    cardTableOptions: useMemo(() => getCardTableOptions(projectId, get(projects, ["data"])), [projectId, projects]),
    columnOptions: useMemo(() => getOptions<Column>(get(columns, ["data", "lists"])), [columns]),
    peopleOptions: useMemo(() => getPeopleOptions(get(people, ["data"])), [people]),
  };
};

export { useFormDeps };
