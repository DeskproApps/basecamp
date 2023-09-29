import { useMemo, useState, useCallback } from "react";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import { useSearchParams, useNavigate, createSearchParams } from "react-router-dom";
import {
  LoadingSpinner,
  useDeskproElements,
  useDeskproAppClient,
  useDeskproLatestAppContext,
} from "@deskpro/app-sdk";
import { useAsyncError, useSetTitle } from "../../hooks";
import { useCard } from "./hooks";
import { setEntityService } from "../../services/deskpro";
import { changeCardColumnService, updateCardService } from "../../services/basecamp";
import { getCardValues, getCardMeta, getColumnToChange } from "../../components/CardForm";
import { entity, getEntityMetadata } from "../../utils";
import { EditCard } from "../../components";
import type { FC } from "react";
import type { Maybe, CardMeta, TicketContext } from "../../types";
import type { Account } from "../../services/basecamp/types";
import type { FormValidationSchema } from "../../components/CardForm";

const EditCardPage: FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { client } = useDeskproAppClient();
  const { context } = useDeskproLatestAppContext() as { context: TicketContext };
  const ticketId = useMemo(() => get(context, ["data", "ticket", "id"]), [context]);
  const { asyncErrorHandler } = useAsyncError();
  const [error, setError] = useState<Maybe<string|string[]>>(null);
  const accountId = searchParams.get("accountId");
  const projectId = searchParams.get("projectId");
  const cardId = searchParams.get("cardId");
  const cardMeta: CardMeta = useMemo(() => ({
    accountId: Number(accountId),
    projectId: Number(projectId),
    cardId: Number(cardId),
  }), [accountId, projectId, cardId]);
  const { isLoading, card, column } = useCard(cardMeta);

  const onCancel = useCallback(() => {
    navigate({
      pathname: `/cards/view`,
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore - react-router wants there to be a `string`, but here a `number`
      search: `?${createSearchParams(cardMeta)}`,
    })
  }, [navigate, cardMeta]);

  const onSubmit = useCallback((values: FormValidationSchema,) => {
    if (!client || !ticketId || isEmpty(values)) {
        return Promise.resolve();
    }

    const { accountId, projectId, columnId } = getCardMeta(values);
    const data = getCardValues(values);

    if (!accountId || !projectId || !columnId) {
        return Promise.resolve();
    }

    return updateCardService(client, accountId, projectId, card.id, data)
      .then((card) => {
        const newColumnId = getColumnToChange(card, values);
        const entityId = entity.generateId({ id: accountId } as Account, card);

        return Promise.all([
          !newColumnId  ? Promise.resolve() : changeCardColumnService(client, accountId, projectId, card.id, newColumnId),
          !entityId ? Promise.resolve() : setEntityService(client, ticketId, entityId, getEntityMetadata(card)),
        ]);
      })
      .then(() => navigate({
        pathname: `/cards/view`,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore - react-router wants there to be a `string`, but here a `number`
        search: `?${createSearchParams(cardMeta)}`,
      }))
      .catch((err) => {
        const error = get(err, ["data", "error", "error"]);

        if (error) {
            setError(error);
        } else {
            asyncErrorHandler(err);
        }
      });
  }, [client, ticketId, navigate, asyncErrorHandler, card, cardMeta]);

  useSetTitle("Edit Card");

  useDeskproElements(({ clearElements, registerElement }) => {
    clearElements();
    registerElement("refresh", { type: "refresh_button" });
    registerElement("home", {
      type: "home_button",
      payload: { type: "changePage", path: "/home" },
    });
  });

  if (isLoading) {
    return (
      <LoadingSpinner />
    );
  }

  return (
    <EditCard
      error={error}
      onSubmit={onSubmit}
      onCancel={onCancel}
      card={card}
      cardMeta={{ ...cardMeta, cardTableId: get(column, ["parent", "id"]) }}
    />
  );
};

export { EditCardPage };
