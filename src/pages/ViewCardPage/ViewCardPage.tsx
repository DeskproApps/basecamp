import { useMemo, useCallback } from "react";
import { useSearchParams, createSearchParams, useNavigate } from "react-router-dom";
import {
  LoadingSpinner,
  useDeskproElements,
  useDeskproAppClient,
} from "@deskpro/app-sdk";
import { changeStepCompleteService } from "../../services/basecamp";
import { useSetTitle, useAsyncError } from "../../hooks";
import { useCard } from "./hooks";
import { queryClient } from "../../query";
import { ViewCard } from "../../components";
import type { FC } from "react";
import type { CardMeta } from "../../types";
import type { CardStep } from "../../services/basecamp/types";

const ViewCardPage: FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { client } = useDeskproAppClient();
  const { asyncErrorHandler } = useAsyncError();
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

  const onNavigateToAddComment = useCallback(() => {
    navigate({
      pathname: "/cards/comments/create",
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore - react-router wants there to be a `string`, but here a `number`
      search: `?${createSearchParams(cardMeta)}`,
    });
  }, [navigate, cardMeta]);

  const changeStepComplete = useCallback((
    stepId: CardStep["id"],
    complete: boolean,
  ): Promise<CardStep|void> => {
    if (!client || !accountId || !projectId) {
      return Promise.resolve();
    }

    return changeStepCompleteService(client, Number(accountId), Number(projectId), stepId, complete)
      .then(() => queryClient.invalidateQueries())
      .catch(asyncErrorHandler);
  }, [client, accountId, projectId, asyncErrorHandler]);

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
        // @ts-ignore - react-router wants there to be a `string`, but here a `number`
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
      onChangeStepComplete={changeStepComplete}
      onNavigateToAddComment={onNavigateToAddComment}
    />
  );
};

export { ViewCardPage };
