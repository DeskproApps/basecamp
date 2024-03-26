import { baseRequest } from "./baseRequest";
import type { IDeskproClient } from "@deskpro/app-sdk";
import type { Account, Project } from "./types";

const getProjectsService = (
  client: IDeskproClient,
  accountId: Account["id"],
) => {
  return baseRequest<Project[]>(client, {
    url: `/${accountId}/projects`,
    pagination: true,
  });
};

export { getProjectsService };
