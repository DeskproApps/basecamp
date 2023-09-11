import { useMemo, useCallback } from "react";
import { useNavigate, createSearchParams } from "react-router-dom";
import { useDeskproElements, LoadingSpinner } from "@deskpro/app-sdk";
import { useSetTitle, useSetBadgeCount, useLinkedCards } from "../../hooks";
import { useHomeDeps } from "./hooks";
import { Home } from "../../components";
import type { FC } from "react";
import type { Card, Account, Project } from "../../services/basecamp/types";

const HomePage: FC = () => {
  const navigate = useNavigate();
  const { isLoading: isLoadingLinked, cards, cardsMeta } = useLinkedCards();
  const { isLoading: isLoadingMeta, accounts, projects } = useHomeDeps();

  const isLoading = useMemo(() => {
    return [isLoadingLinked, isLoadingMeta].some(Boolean);
  }, [isLoadingLinked, isLoadingMeta]);

  const onNavigateToCard = useCallback((
    accountId: Account["id"],
    projectId: Project["id"],
    cardId: Card["id"],
  ) => {
    navigate({
      pathname: "/cards/view",
      search: `?${createSearchParams({
        accountId: `${accountId}`,
        projectId: `${projectId}`,
        cardId: `${cardId}`,
      })}`,
    });
  }, [navigate]);

  useSetTitle("Basecamp");

  useSetBadgeCount(cards);

  useDeskproElements(({ registerElement, clearElements }) => {
    clearElements();
    registerElement("refresh", { type: "refresh_button" });
    registerElement("plus", {
      type: "plus_button",
      payload: { type: "changePage", path: "/cards/link" },
    });
    registerElement("menu", {
      type: "menu",
      items: [{
        title: "Log Out",
        payload: {
          type: "logout",
        },
      }],
    });
  });

  if (isLoading) {
    return (
      <LoadingSpinner/>
    );
  }

  return (
    <Home
      cards={cards}
      projects={projects}
      accounts={accounts}
      cardsMeta={cardsMeta}
      onNavigateToCard={onNavigateToCard}
    />
  );
};

export { HomePage };
