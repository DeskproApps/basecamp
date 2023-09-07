import { useState, useMemo, useCallback } from "react";
import get from "lodash/get";
import find from "lodash/find";
import size from "lodash/size";
import cloneDeep from "lodash/cloneDeep";
import { useNavigate } from "react-router-dom";
import {
  useDeskproElements,
  useDeskproAppClient,
  useDeskproLatestAppContext,
} from "@deskpro/app-sdk";
import { setEntityService } from "../../services/deskpro";
import { useSetTitle, useAsyncError } from "../../hooks";
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

  const onLinkCards = useCallback(() => {
    if (!client || !ticketId || !size(selectedCards)) {
      return;
    }

    setIsSubmitting(true);

    return Promise.all([
      ...selectedCards.map((card) => {
        const cardData = entity.generateId(account, card);
        return !cardData ? Promise.resolve() : setEntityService(client, ticketId, cardData);
      })
    ])
      .then(() => navigate("/home"))
      .catch(asyncErrorHandler)
      .finally(() => setIsSubmitting(false));
  }, [client, ticketId, selectedCards, account, asyncErrorHandler, navigate]);

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
      cards={filterCards(cards, { query: searchQuery })}
    />
  );
};

export { LinkCardsPage };
