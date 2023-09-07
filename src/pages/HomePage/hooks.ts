import { useMemo } from "react";
import get from "lodash/get";
import size from "lodash/size";
import flatten from "lodash/flatten";
import { useQueryWithClient } from "@deskpro/app-sdk";
import { useQueriesWithClient } from "../../hooks";
import { QueryKey } from "../../query";
import { getAuthInfoService, getProjectsService } from "../../services/basecamp";
import type { IDeskproClient } from "@deskpro/app-sdk";
import type { Account, Project } from "../../services/basecamp/types";

export type Result = {
  isLoading: boolean,
  accounts: Account[],
  projects: Project[],
};

const useHomeDeps = (): Result => {
  const accountsFetched = useQueryWithClient([QueryKey.ACCOUNTS], getAuthInfoService);

  const accounts = useMemo(() => {
    return get(accountsFetched, ["data", "accounts"], []) || [];
  }, [accountsFetched]);

  const projects = useQueriesWithClient(accounts.map(({ id }: Account) => ({
    queryKey: [QueryKey.PROJECTS, id],
    queryFn: (client: IDeskproClient) => getProjectsService(client, id),
    enabled: Boolean(size(accounts)),
    useErrorBoundary: false,
  })));

  return {
    isLoading: [accounts, ...projects].some(({ isLoading }) => isLoading),
    accounts,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    projects: flatten(projects.map(({ data }) => data) as Project[]).filter(Boolean),
  };
}

export { useHomeDeps };
