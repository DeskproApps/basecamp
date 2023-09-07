import get from "lodash/get";
import isString from "lodash/isString";
import split from "lodash/split";
import type { Maybe, CardMeta, CardMetaAsString } from "../types";
import type { Card, Account } from "../services/basecamp/types";

const generateId = (
  account?: Maybe<Account>,
  card?: Maybe<Card>,
): Maybe<CardMetaAsString> => {
  const accountId = get(account, ["id"]);
  const projectId = get(card, ["bucket", "id"]);
  const cardId = get(card, ["id"]);

  if (!cardId || !projectId || !accountId) {
    return;
  }

  return `${accountId}/${projectId}/${cardId}`;
};

const parseId = (meta?: CardMetaAsString): Maybe<CardMeta> => {
  if (!meta || !isString(meta)) {
    return;
  }

  const [accountId, projectId, cardId] = split(meta, "/");

  return {
    accountId: Number(accountId),
    projectId: Number(projectId),
    cardId: Number(cardId),
  };
};

const entity = { generateId, parseId };

export { entity };
