import { useMemo } from "react";
import { useSearchParams, createSearchParams } from "react-router-dom";
import { LoadingSpinner, useDeskproElements } from "@deskpro/app-sdk";
import { useSetTitle } from "../../hooks";
import { useCard } from "./hooks";
import { ViewCard } from "../../components";
import type { FC } from "react";
import type { CardMeta } from "../../types";

const ViewCardPage: FC = () => {
  const [searchParams] = useSearchParams();
  const accountId = searchParams.get("accountId");
  const projectId = searchParams.get("projectId");
  const cardId = searchParams.get("cardId");
  const cardMeta: CardMeta = useMemo(() => {
    return {
      accountId: Number(accountId),
      projectId: Number(projectId),
      cardId: Number(cardId),
    };
  }, [accountId, projectId, cardId]);
  const { card, account, project, isLoading, comments } = useCard(cardMeta);

  useSetTitle("Basecamp");

  useDeskproElements(({ clearElements, registerElement }) => {
    clearElements();
    registerElement("refresh", { type: "refresh_button" });
    registerElement("home", {
      type: "home_button",
      payload: { type: "changePage", path: "/home" },
    });
    registerElement("edit", {
      type: "edit_button",
      payload: { type: "changePage", path: {
        pathname: `/cards/edit`,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        search: `?${createSearchParams(cardMeta)}`,
      }}
    });
    registerElement("menu", {
      type: "menu",
      items: [{
        title: "Unlink card",
        payload: { type: "unlink", card, meta: cardMeta },
      }],
    });
  }, [card, cardMeta]);

  if (isLoading) {
    return (
      <LoadingSpinner/>
    );
  }

  return (
    <ViewCard
      card={card}
      account={account}
      project={project}
      comments={comments}
    />
  );
};

export { ViewCardPage };
