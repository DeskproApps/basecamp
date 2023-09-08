import { baseRequest } from "./baseRequest";
import type { IDeskproClient } from "@deskpro/app-sdk";
import type { Account, Project } from "./types";

const getProjectService = (
  client: IDeskproClient,
  accountId: Account["id"],
  projectId: Project["id"],
) => {
  return baseRequest<Project>(client, {
    url: `/${accountId}/project/${projectId}`,
  });
};

export { getProjectService };
