import isEmpty from "lodash/isEmpty";
import { Project } from "../services/basecamp/types";
import type { CardTableTree } from "../types";

const getCardTables = (projects?: Project[]): CardTableTree => {
  if (!Array.isArray(projects)) {
    return [];
  }

  return projects
    .filter(({ status }) => status === "active")
    .map(({ id, name, dock }) => ({
      id,
      name,
      cardTables: dock
        .filter(({ name, enabled }) => (name === "kanban_board" && enabled))
        .map(({ id, title }) => ({ id, name: title }))
    }))
    .filter(({ cardTables }) => !isEmpty(cardTables));
};

export { getCardTables };
