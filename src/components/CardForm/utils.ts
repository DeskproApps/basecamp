import { createElement } from "react";
import get from "lodash/get";
import size from "lodash/size";
import find from "lodash/find";
import isEmpty from "lodash/isEmpty";
import { z } from "zod";
import { getOption } from "../../utils";
import { format } from "../../utils/date";
import { API_DATE_FORMAT } from "../../constants";
import { Member } from "../common";
import type { Option } from "../../types";
import type {Project, CardTable, Person, Account, Column} from "../../services/basecamp/types";
import type { FormValidationSchema, CardValues } from "./types";

const validationSchema = z.object({
  account: z.number().positive(),
  project: z.number().positive(),
  cardTable: z.number().positive(),
  column: z.number().positive(),
  title: z.string().nonempty(),
  assignees: z.array(z.number()).optional(),
  dueDate: z.date().optional(),
  content: z.string().optional(),
});

const getInitValues = (): FormValidationSchema => {
  return {
    account: 0,
    project: 0,
    cardTable: 0,
    column: 0,
    title: "",
    assignees: [],
    dueDate: undefined,
    content: "",
  };
};

const getCardValues = (values: FormValidationSchema): CardValues => {
  const content = get(values, ["content"]);
  const dueDate = get(values, ["dueDate"], null);
  const assigneeIds = get(values, ["assignees"], []) || [];

  return {
    title: get(values, ["title"]),
    ...(!content ? {} : { content }),
    ...(!dueDate ? {} :  { due_on: format(dueDate, API_DATE_FORMAT) }),
    ...(isEmpty(assigneeIds) ? {} : { assignee_ids: assigneeIds }),
  };
};

const getCardMeta = (values: FormValidationSchema): {
  accountId?: Account["id"],
  projectId?: Project["id"],
  columnId?: Column["id"],
} => {
  return {
    accountId: get(values, ["account"]),
    projectId: get(values, ["project"]),
    columnId: get(values, ["column"]),
  };
};

const getOptions = <T>(items?: T[]) => {
  if (!Array.isArray(items) || !size(items)) {
    return [];
  }

  return items.map((item) => {
    return getOption(get(item, ["id"]), get(item, ["name"]) || get(item, ["title"]));
  });
};

const getCardTableOptions = (
  projectId?: Project["id"],
  projects?: Project[],
): Array<Option<CardTable["id"]>> => {
  if (!projectId || !Array.isArray(projects) || !size(projects)) {
    return [];
  }

  const project = find(projects, { id: projectId });

  return (get(project, ["dock"], []) || [])
    .filter(({ name, enabled }) => name === "kanban_board" && enabled)
    .map(({ id, title }) => getOption(id, title));
};

const getPeopleOptions = (persons?: Person[]) => {
  if (!Array.isArray(persons) || !size(persons)) {
    return [];
  }

  return persons.map((person) => {
    const fullName = get(person, ["name"]) || get(person, ["email_address"]);
    const label = createElement(Member, {
      key: get(person, ["id"]),
      name: fullName,
      avatarUrl: get(person, ["avatar_url"])
    });
    return getOption(person.id, label, fullName);
  });
};

export {
  getOptions,
  getCardMeta,
  getInitValues,
  getCardValues,
  validationSchema,
  getPeopleOptions,
  getCardTableOptions,
};
