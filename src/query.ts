import { QueryClient } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      suspense: false,
      useErrorBoundary: true,
      refetchOnWindowFocus: false,
    },
  },
});

const QueryKey = {
  ACCOUNTS: "accounts",
  PROJECTS: "projects",
  TABLE: "table",
  CARD: "card",
  CARDS: "cards",
}

export { queryClient, QueryKey };
