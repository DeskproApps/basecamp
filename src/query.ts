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
  CARD_TABLES: "cardTables",
  LINKED_CARDS: "linkedCard",
  CARD_COMMENTS: "cardComments",
  PEOPLE_BY_PROJECT: "peopleByProject",
}

export { queryClient, QueryKey };
