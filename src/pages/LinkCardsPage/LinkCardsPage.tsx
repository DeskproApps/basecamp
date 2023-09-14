import { useState, useMemo, useCallback } from "react";
import get from "lodash/get";
import find from "lodash/find";
import size from "lodash/size";
import isEmpty from "lodash/isEmpty";
import cloneDeep from "lodash/cloneDeep";
import { useNavigate } from "react-router-dom";
import {
  useDeskproElements,
  useDeskproAppClient,
  useDeskproLatestAppContext,
} from "@deskpro/app-sdk";
import { setEntityService } from "../../services/deskpro";
import { useSetTitle, useAsyncError, useLinkedAutoComment, useReplyBox } from "../../hooks";
import { useSearchCards } from "./hooks";
import { entity, filterCards } from "../../utils";
import { LinkCards } from "../../components";
import type { FC } from "react";
import type { Maybe, TicketContext } from "../../types";
import type { Card, Account, CardTable } from "../../services/basecamp/types";

const LinkCardsPage: FC = () => {
  const navigate = useNavigate();
  const { client } = useDeskproAppClient();
  const { context } = useDeskproLatestAppContext() as { context: TicketContext };
  const { asyncErrorHandler } = useAsyncError();
  const { addLinkComment } = useLinkedAutoComment();
  const { setSelectionState } = useReplyBox();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCards, setSelectedCards] = useState<Card[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<Maybe<Account["id"]>>(null);
  const [selectedCardTable, setSelectedCardTable] = useState<Maybe<CardTable["id"]>>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const {
    cards,
    projects,
    accounts,
    isLoading,
    cardTables,
  } = useSearchCards(selectedAccount, selectedCardTable);
  const ticketId = useMemo(() => get(context, ["data", "ticket", "id"]), [context]);
  const account = useMemo(() => find(accounts, { id: selectedAccount }), [accounts, selectedAccount]) as Maybe<Account>;

  const onChangeSearch = useCallback((search: string) => {
    setSearchQuery(search);
  }, []);

  const onChangeSelectedCard = useCallback((card: Card) => {
    let newSelectedCards = cloneDeep(selectedCards);

    if (selectedCards.some((selectedCard) => card.id === selectedCard.id)) {
      newSelectedCards = selectedCards.filter((selectedCard) => {
        return selectedCard.id !== card.id;
      });
    } else {
      newSelectedCards.push(card);
    }

    setSelectedCards(newSelectedCards);
  }, [selectedCards]);

  const onCancel = useCallback(() => navigate("/home"), [navigate]);

  const onNavigateToCreate = useCallback(() => navigate("/cards/create"), [navigate]);

  const onLinkCards = useCallback(() => {
    if (!client || !ticketId || !size(selectedCards) || isEmpty(account)) {
      return;
    }

    setIsSubmitting(true);

    return Promise.all([
      ...selectedCards.map((card) => {
        const cardMeta = entity.generateId(account, card);
        return !cardMeta ? Promise.resolve() : setEntityService(client, ticketId, cardMeta);
      }),
      ...selectedCards.map((card) => addLinkComment({
        accountId: get(account, ["id"]),
        projectId: get(card, ["bucket", "id"]),
        cardId: get(card, ["id"]),
      })),
      ...selectedCards.map((card) => {
        const entityId = entity.generateId(account, card);
        return !entityId ? Promise.resolve() : setSelectionState(entityId, true, "email");
      }),
      ...selectedCards.map((card) => {
        const entityId = entity.generateId(account, card);
        return !entityId ? Promise.resolve() : setSelectionState(entityId, true, "note");
      }),
    ])
      .then(() => navigate("/home"))
      .catch(asyncErrorHandler)
      .finally(() => setIsSubmitting(false));
  }, [client, ticketId, selectedCards, account, asyncErrorHandler, navigate, addLinkComment, setSelectionState]);

  useSetTitle("Link Cards");

  useDeskproElements(({ clearElements, registerElement }) => {
    clearElements();
    registerElement("refresh", { type: "refresh_button" });
    registerElement("home", {
      type: "home_button",
      payload: { type: "changePage", path: "/home" },
    });
  });

  return (
    <LinkCards
      account={account}
      accounts={accounts}
      onCancel={onCancel}
      projects={projects}
      isLoading={isLoading}
      cardTables={cardTables}
      onLinkCards={onLinkCards}
      isSubmitting={isSubmitting}
      selectedCards={selectedCards}
      onChangeSearch={onChangeSearch}
      selectedAccount={selectedAccount}
      onChangeAccount={setSelectedAccount}
      selectedCardTable={selectedCardTable}
      onChangeCardTable={setSelectedCardTable}
      onChangeSelectedCard={onChangeSelectedCard}
      onNavigateToCreate={onNavigateToCreate}
      cards={filterCards(cards, { query: searchQuery })}
    />
  );
};

export { LinkCardsPage };
