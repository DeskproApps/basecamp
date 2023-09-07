import { useMemo } from "react";
import { useDeskproElements, LoadingSpinner } from "@deskpro/app-sdk";
import { useSetTitle, useSetBadgeCount, useLinkedCards } from "../../hooks";
import { useHomeDeps } from "./hooks";
import { Home } from "../../components";
import type { FC } from "react";

const HomePage: FC = () => {
  const { isLoading: isLoadingLinked, cards, cardsMeta } = useLinkedCards();
  const { isLoading: isLoadingMeta, accounts, projects } = useHomeDeps();
  const isLoading = useMemo(() => {
    return [isLoadingLinked, isLoadingMeta].some(Boolean);
  }, [isLoadingLinked, isLoadingMeta]);

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
      cardsMeta={cardsMeta}
      projects={projects}
      accounts={accounts}
    />
  );
};

export { HomePage };
