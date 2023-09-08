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
  CARD: "card",
  CARDS: "cards",
  TABLE: "table",
  PROJECT: "project",
  PROJECTS: "projects",
  ACCOUNTS: "accounts",
  LINKED_CARDS: "linkedCard",
  CARD_COMMENTS: "cardComments",
}

export { queryClient, QueryKey };
