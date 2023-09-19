import { QueryClient } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      suspense: false,
      useErrorBoundary: true,
      refetchOnWindowFocus: false,
      retry: 1,
      retryDelay: 2000,
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
  CARD_TABLES: "cardTables",
  LINKED_CARDS: "linkedCard",
  TABLE_COLUMN: "tableColumn",
  CARD_COMMENTS: "cardComments",
  PEOPLE_BY_PROJECT: "peopleByProject",
}

export { queryClient, QueryKey };
