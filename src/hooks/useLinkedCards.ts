import { useMemo } from "react";
import get from "lodash/get";
import size from "lodash/size";
import { useQueryWithClient, useDeskproLatestAppContext } from "@deskpro/app-sdk";
import { getEntityListService } from "../services/deskpro";
import { getCardService } from "../services/basecamp";
import { useQueriesWithClient } from "./useQueriesWithClient";
import { entity } from "../utils";
import { QueryKey } from "../query";
import type { TicketContext, CardMeta } from "../types";
import type { Card } from "../services/basecamp/types";

export type Result = {
  isLoading: boolean;
  cards: Card[];
  cardsMeta: CardMeta[];
};

const useLinkedCards = (): Result => {
  const { context } = useDeskproLatestAppContext() as { context: TicketContext };
  const ticketId = useMemo(() => get(context, ["data", "ticket", "id"]), [context]);

  const linkedIds = useQueryWithClient(
    [QueryKey.LINKED_CARDS, ticketId],
    (client) => getEntityListService(client, ticketId),
    { enabled: Boolean(ticketId) },
  );

  const fetchedCards = useQueriesWithClient((get(linkedIds, ["data"], []) || []).map((cardMeta) => {
    const meta = entity.parseId(cardMeta);
    return {
      queryKey: [QueryKey.CARD, cardMeta],
      queryFn: (client) => (!meta
          ? Promise.resolve()
          : getCardService(client, meta.accountId, meta.projectId, meta.cardId)
      ) as Promise<void|Card>,
      enabled: Boolean(size(linkedIds)),
      useErrorBoundary: false,
    }
  }));

  const cards = useMemo(() => {
    return fetchedCards.map(({ data }) => data).filter(Boolean)
  }, [fetchedCards]);

  return {
    isLoading: [linkedIds, ...fetchedCards].some(({ isLoading }) => isLoading),
    cards: cards as Card[],
    cardsMeta: (get(linkedIds, ["data"], []) || []).map(entity.parseId) as CardMeta[],
  };
};

export { useLinkedCards };
