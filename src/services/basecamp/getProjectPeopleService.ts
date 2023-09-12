import { baseRequest } from "./baseRequest";
import type { IDeskproClient } from "@deskpro/app-sdk";
import type { Account, Project, Person } from "./types";

const getProjectPeopleService = (
  client: IDeskproClient,
  accountId: Account["id"],
  projectId: Project["id"],
) => {
  return baseRequest<Person[]>(client, {
    url: `/${accountId}/projects/${projectId}/people`,
  });
};

export { getProjectPeopleService };
