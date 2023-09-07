import get from "lodash/get";
import isString from "lodash/isString";
import split from "lodash/split";
import type { Maybe } from "../types";
import type { Card, Account, Project } from "../services/basecamp/types";

const generateId = (account?: Maybe<Account>, card?: Maybe<Card>): string|undefined => {
  const accountId = get(account, ["id"]);
  const projectId = get(card, ["bucket", "id"]);
  const cardId = get(card, ["id"]);

  if (!cardId || !projectId || !accountId) {
    return;
  }

  return `${accountId}/${projectId}/${cardId}`;
};

const parseId = (data?: string): void|{
  accountId: Account["id"],
  projectId: Project["id"],
  cardId: Card["id"],
} => {
  if (!data || !isString(data)) {
    return;
  }

  const [accountId, projectId, cardId] = split(data, "/");

  return {
    accountId: Number(accountId),
    projectId: Number(projectId),
    cardId: Number(cardId),
  };
};

const entity = { generateId, parseId };

export { entity };
