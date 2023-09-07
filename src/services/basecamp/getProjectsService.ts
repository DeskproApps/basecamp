import { baseRequest } from "./baseRequest";
import type { IDeskproClient } from "@deskpro/app-sdk";
import type { Account, Project } from "./types";

const getProjectsService = (
  client: IDeskproClient,
  accountId: Account["id"],
): Promise<Project[]> => {
  return baseRequest(client, {
    url: `/${accountId}/projects`
  });
};

export { getProjectsService };
