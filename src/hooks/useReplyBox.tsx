import { useMemo, useCallback, useContext, createContext } from "react";
import get from "lodash/get";
import has from "lodash/has";
import size from "lodash/size";
import find from "lodash/find";
import truncate from "lodash/truncate";
import { match } from "ts-pattern";
import { useDebouncedCallback } from "use-debounce";
import {
  useDeskproAppClient,
  useDeskproAppEvents,
  useDeskproLatestAppContext,
  useInitialisedDeskproAppClient,
} from "@deskpro/app-sdk";
import { useLinkedCards } from "./useLinkedCards";
import { getEntityListService } from "../services/deskpro";
import { createCardCommentService } from "../services/basecamp";
import { queryClient } from "../query";
import { entity } from "../utils";
import { APP_PREFIX } from "../constants";
import type { FC, PropsWithChildren } from "react";
import type { IDeskproClient, GetStateResponse, TargetAction } from "@deskpro/app-sdk";
import type { Card, Account, Project } from "../services/basecamp/types";
import type { CardMetaAsString, TicketContext, TicketData } from "../types";

export type ReplyBoxType = "note" | "email";

export type SetSelectionState = (
  cardMetaAsString: CardMetaAsString,
  selected: boolean,
  type: ReplyBoxType,
) => void|Promise<{ isSuccess: boolean }|void>;

export type GetSelectionState = (
  cardMetaAsString: CardMetaAsString,
  type: ReplyBoxType,
) => void|Promise<Array<GetStateResponse<string>>>;

export type DeleteSelectionState = (
  cardMetaAsString: CardMetaAsString,
  type: ReplyBoxType,
) => void|Promise<boolean|void>;

type ReturnUseReplyBox = {
  setSelectionState: SetSelectionState,
  getSelectionState: GetSelectionState,
  deleteSelectionState: DeleteSelectionState,
};

const noteKey = (ticketId: string, linkedCardId: CardMetaAsString|"*") => {
  return `tickets/${ticketId}/${APP_PREFIX}/notes/selection/${linkedCardId}`.toLowerCase();
};

const emailKey = (ticketId: string, linkedCardId: CardMetaAsString|"*") => {
  return `tickets/${ticketId}/${APP_PREFIX}/emails/selection/${linkedCardId}`.toLowerCase();
};

const registerReplyBoxNotesAdditionsTargetAction = (
  client: IDeskproClient,
  ticketId: TicketData["ticket"]["id"],
  cardIds: CardMetaAsString[],
  cardsMap: Record<CardMetaAsString, Card>,
): void|Promise<void> => {
  if (!ticketId) {
    return;
  }

  if (Array.isArray(cardIds) && !size(cardIds)) {
    return client.deregisterTargetAction(`${APP_PREFIX}ReplyBoxNoteAdditions`);
  }

  return Promise
    .all(cardIds.map((cardId) => client.getState<{ selected: boolean }>(noteKey(ticketId, cardId))))
    .then((flags) => {
      client.registerTargetAction(`${APP_PREFIX}ReplyBoxNoteAdditions`, "reply_box_note_item_selection", {
        title: "Add to Basecamp",
        payload: cardIds.map((cardId, idx) => ({
          id: cardId,
          title: has(cardsMap, [cardId, "title"])
            ? truncate(cardsMap[cardId].title, { length: 20 })
            : get(entity.parseId(cardId), ["cardId"]),
          selected: flags[idx][0]?.data?.selected ?? false,
        })),
      });
    });
};

const registerReplyBoxEmailsAdditionsTargetAction = (
  client: IDeskproClient,
  ticketId: TicketData["ticket"]["id"],
  cardIds: CardMetaAsString[],
  cardsMap: Record<CardMetaAsString, Card>,
): void|Promise<void> => {
  if (!ticketId) {
    return;
  }

  if (Array.isArray(cardIds) && !size(cardIds)) {
    return client.deregisterTargetAction(`${APP_PREFIX}ReplyBoxEmailAdditions`);
  }

  return Promise
    .all(cardIds.map((cardId) => client.getState<{ selected: boolean }>(emailKey(ticketId, cardId))))
    .then((flags) => {
      return client.registerTargetAction(`${APP_PREFIX}ReplyBoxEmailAdditions`, "reply_box_email_item_selection", {
        title: "Add to Basecamp",
        payload: cardIds.map((cardId, idx) => {
          return ({
            id: cardId,
            title: has(cardsMap, [cardId, "title"])
              ? truncate(cardsMap[cardId].title, { length: 20 })
              : get(entity.parseId(cardId), ["cardId"]),
            selected: flags[idx][0]?.data?.selected ?? false,
          })
        }),
      });
    });
};

const ReplyBoxContext = createContext<ReturnUseReplyBox>({
  setSelectionState: () => {},
  getSelectionState: () => {},
  deleteSelectionState: () => {},
});

const getCardsMap = (
  cards?: Card[],
  cardsMetaAsString?: CardMetaAsString[],
): Record<CardMetaAsString, Card> => {
  const cardsMeta = (cardsMetaAsString || []).map(entity.parseId).filter(Boolean);

  if (!Array.isArray(cards) || !size(cards) || !Array.isArray(cardsMeta) || !size(cardsMeta)) {
    return {};
  }

  return cardsMeta.reduce<Record<CardMetaAsString, Card>>((acc, linkedCardMeta) => {
    const card = find(cards, { id: get(linkedCardMeta, ["cardId"]) });
    const linkedCardId = entity.generateId({ id: get(linkedCardMeta, ["accountId"]) } as Account, card);

    if (card && linkedCardId) {
      acc[linkedCardId] = card;
    }

    return acc;
  }, {});
};

const useReplyBox = () => useContext<ReturnUseReplyBox>(ReplyBoxContext);

const ReplyBoxProvider: FC<PropsWithChildren> = ({ children }) => {
  const { context } = useDeskproLatestAppContext() as { context: TicketContext };
  const { client } = useDeskproAppClient();
  const { cards, cardsMeta } = useLinkedCards();
  const cardsMap = useMemo(() => getCardsMap(cards, cardsMeta), [cards, cardsMeta]);

  const ticketId = get(context, ["data", "ticket", "id"]);
  const isCommentOnNote = get(context, ["settings", "default_comment_on_ticket_note"]);
  const isCommentOnEmail = get(context, ["settings", "default_comment_on_ticket_reply"]);

  const setSelectionState: SetSelectionState = useCallback((cardMetaAsString, selected, type) => {
    if (!ticketId || !client) {
      return
    }

    if (type === "note" && isCommentOnNote) {
      return client.setState(noteKey(ticketId, cardMetaAsString), { id: cardMetaAsString, selected })
        .then(() => getEntityListService(client, ticketId))
        .then((cardIds) => registerReplyBoxNotesAdditionsTargetAction(client, ticketId, cardIds as CardMetaAsString[], cardsMap))
        .catch(() => {})
    }

    if (type === "email" && isCommentOnEmail) {
      return client?.setState(emailKey(ticketId, cardMetaAsString), { id: cardMetaAsString, selected })
        .then(() => getEntityListService(client, ticketId))
        .then((cardIds) => registerReplyBoxEmailsAdditionsTargetAction(client, ticketId, cardIds as CardMetaAsString[], cardsMap))
        .catch(() => {})
    }
  }, [client, ticketId, isCommentOnNote, isCommentOnEmail, cardsMap]);

  const getSelectionState: GetSelectionState = useCallback((cardMetaAsString, type) => {
    if (!ticketId) {
      return
    }

    const key = (type === "email") ? emailKey : noteKey;
    return client?.getState<string>(key(ticketId, cardMetaAsString))
  }, [client, ticketId]);

  const deleteSelectionState: DeleteSelectionState = useCallback((cardMetaAsString, type) => {
    if (!ticketId || !client) {
      return;
    }

    const key = (type === "email") ? emailKey : noteKey;

    return client.deleteState(key(ticketId, cardMetaAsString))
      .then(() => getEntityListService(client, ticketId))
      .then((cardIds) => {
        const register = (type === "email") ? registerReplyBoxEmailsAdditionsTargetAction : registerReplyBoxNotesAdditionsTargetAction;
        return register(client, ticketId, cardIds as CardMetaAsString[], cardsMap);
      })
  }, [client, ticketId, cardsMap]);

  const debounceTargetAction = useDebouncedCallback<(a: TargetAction) => void>((action: TargetAction) => {
    match<string>(action.name)
      .with(`${APP_PREFIX}OnReplyBoxEmail`, () => {
        const subjectTicketId = action.subject;
        const email = action.payload.email;

        if (!ticketId || !email || !client) {
          return;
        }

        if (subjectTicketId !== ticketId) {
          return;
        }

        client.setBlocking(true);
        client.getState<{ id: string; selected: boolean }>(emailKey(ticketId, "*"))
          .then((selections) => {
            const cardIds = selections
              .filter(({ data }) => data?.selected)
              .map(({ data }) => data?.id);

            return Promise
              .all(cardIds.map((cardIdAsString) => {
                const { accountId, projectId, cardId } = entity.parseId(cardIdAsString) || {};

                if (!accountId || !projectId || !cardId) {
                  return Promise.resolve();
                } else {
                  return createCardCommentService(
                    client,
                    accountId as Account["id"],
                    projectId as Project["id"],
                    cardId as Card["id"],
                    { content: email }
                  );
                }
              }))
              .then(() => queryClient.invalidateQueries());
          })
          .finally(() => client.setBlocking(false));
      })
      .with(`${APP_PREFIX}OnReplyBoxNote`, () => {
        const subjectTicketId = action.subject;
        const note = action.payload.note;

        if (!ticketId || !note || !client) {
          return;
        }

        if (subjectTicketId !== ticketId) {
          return;
        }

        client.setBlocking(true);
        client.getState<{ id: string; selected: boolean }>(noteKey(ticketId, "*"))
          .then((selections) => {
            const cardIds = selections
              .filter(({ data }) => data?.selected)
              .map(({ data }) => data?.id);

            return Promise
              .all(cardIds.map((cardIdAsString) => {
                const { accountId, projectId, cardId } = entity.parseId(cardIdAsString) || {};

                if (!accountId || !projectId || !cardId) {
                  return Promise.resolve();
                } else {
                  return createCardCommentService(
                      client,
                      accountId as Account["id"],
                      projectId as Project["id"],
                      cardId as Card["id"],
                      { content: note }
                  );
                }
              }))
              .then(() => queryClient.invalidateQueries());
          })
          .finally(() => client.setBlocking(false));
      })
      .with(`${APP_PREFIX}ReplyBoxEmailAdditions`, () => {
        (action.payload ?? []).forEach((selection: { id: never, selected: boolean }) => {
          const subjectTicketId = action.subject;

          if (ticketId) {
            client?.setState(emailKey(subjectTicketId, selection.id), { id: selection.id, selected: selection.selected })
              .then((result) => {
                if (result.isSuccess) {
                  registerReplyBoxEmailsAdditionsTargetAction(client, ticketId, cardsMeta, cardsMap);
                }
              });
          }
        })
      })
      .with(`${APP_PREFIX}ReplyBoxNoteAdditions`, () => {
        (action.payload ?? []).forEach((selection: { id: never, selected: boolean }) => {
          const subjectTicketId = action.subject;

          if (ticketId) {
            client?.setState(noteKey(subjectTicketId, selection.id), { id: selection.id, selected: selection.selected })
              .then((result) => {
                if (result.isSuccess) {
                  registerReplyBoxNotesAdditionsTargetAction(client, subjectTicketId, cardsMeta, cardsMap);
                }
              });
          }
        })
      })
      .run();
  }, 200);

  useInitialisedDeskproAppClient((client) => {
    if (!ticketId) {
      return;
    };
    
    if (isCommentOnNote) {
      registerReplyBoxNotesAdditionsTargetAction(client, ticketId, cardsMeta, cardsMap);
      client.registerTargetAction(`${APP_PREFIX}OnReplyBoxNote`, "on_reply_box_note");
    }

    if (isCommentOnEmail) {
      registerReplyBoxEmailsAdditionsTargetAction(client, ticketId, cardsMeta, cardsMap);
      client.registerTargetAction(`${APP_PREFIX}OnReplyBoxEmail`, "on_reply_box_email");
    }
  }, [ticketId, isCommentOnNote, isCommentOnEmail, cards, cardsMap]);

  useDeskproAppEvents({
    onTargetAction: debounceTargetAction,
  }, [context?.data]);

  return (
    <ReplyBoxContext.Provider value={{
      setSelectionState,
      getSelectionState,
      deleteSelectionState,
    }}>
      {children}
    </ReplyBoxContext.Provider>
  );
};

export { useReplyBox, ReplyBoxProvider, getCardsMap };
