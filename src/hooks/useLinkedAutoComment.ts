import { useCallback, useState, useMemo } from "react";
import get from "lodash/get";
import {
  useDeskproAppClient,
  useDeskproLatestAppContext,
} from "@deskpro/app-sdk";
import { createCardCommentService } from "../services/basecamp";
import type { CardComment } from "../services/basecamp/types";
import type { CardMeta, TicketContext } from "../types";

export type Result = {
  isLoading: boolean,
  addLinkComment: (cardMeta?: CardMeta) => Promise<void|CardComment>,
  addUnlinkComment: (cardMeta?: CardMeta) => Promise<void|CardComment>,
};

const getLinkedMessage = (ticketId: string, link?: string): string => {
  return `Linked to Deskpro ticket ${ticketId}${link ? `, ${link}` : ""}`
};

const getUnlinkedMessage = (ticketId: string, link?: string): string => {
  return `Unlinked from Deskpro ticket ${ticketId}${link ? `, ${link}` : ""}`
};

const useLinkedAutoComment = (): Result => {
  const { client } = useDeskproAppClient();
  const { context } = useDeskproLatestAppContext() as { context: TicketContext };
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const isEnable = useMemo(() => get(context, ["settings", "add_comment_when_linking"], false), [context]);
  const ticketId = useMemo(() => get(context, ["data", "ticket", "id"]), [context]);
  const permalink = useMemo(() => get(context, ["data", "ticket", "permalinkUrl"]), [context]);

  const addLinkComment = useCallback((cardMeta?: CardMeta) => {
    const { cardId, accountId, projectId } = cardMeta || {};

    if (!client || !isEnable || !accountId || !projectId || !cardId) {
      return Promise.resolve();
    }

    setIsLoading(true);
    return createCardCommentService(
      client,
      accountId,
      projectId,
      cardId,
      { content: getLinkedMessage(ticketId, permalink) }
    )
      .finally(() => setIsLoading(false));
  }, [client, isEnable, ticketId, permalink]);

  const addUnlinkComment = useCallback((cardMeta?: CardMeta) => {
    const { cardId, accountId, projectId } = cardMeta || {};

    if (!client || !isEnable || !accountId || !projectId || !cardId) {
      return Promise.resolve();
    }

    setIsLoading(true)
    return createCardCommentService(
      client,
      accountId,
      projectId,
      cardId,
      { content: getUnlinkedMessage(ticketId, permalink) },
    )
      .finally(() => setIsLoading(false));
  }, [client, isEnable, ticketId, permalink]);

  return { isLoading, addLinkComment, addUnlinkComment };
};

export {
  getLinkedMessage,
  getUnlinkedMessage,
  useLinkedAutoComment,
};
