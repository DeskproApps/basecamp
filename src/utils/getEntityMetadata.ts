import get from "lodash/get";
import size from "lodash/size";
import isEmpty from "lodash/isEmpty";
import type { EntityMetadata } from "../types";
import type { Card, Account } from "../services/basecamp/types";

const getEntityMetadata = (
  card?: Card,
  account?: Account,
): EntityMetadata|undefined => {
  if (isEmpty(card)) {
    return;
  }

  const accountId = get(account, ["id"]);
  const accountName = get(account, ["name"]);
  const dueDate = get(card, ["due_on"]);
  const assignees = get(card, ["assignees"], []) || [];

  const metadata: EntityMetadata = {
      id: get(card, ["id"]),
      title: get(card, ["title"]),
      project: {
          id: get(card, ["bucket", "id"]),
          title: get(card, ["bucket", "name"]),
      },
      column: get(card, ["parent", "title"]),
  };

  if (accountId && accountName) {
    metadata.account = { id: accountId, title: accountName };
  }

  if (dueDate) {
    metadata.dueDate = dueDate
  }

  if (Array.isArray(assignees) && size(assignees)) {
    metadata.assignees = assignees.map(({ id, name, email_address }) => ({
      id,
      fullName: name || email_address || "",
    }));
  }

  return metadata;
};

export { getEntityMetadata };
