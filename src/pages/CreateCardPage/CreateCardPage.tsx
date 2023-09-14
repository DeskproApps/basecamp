import { useCallback, useMemo, useState } from "react";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import { useNavigate } from "react-router-dom";
import {
  useDeskproElements,
  useDeskproAppClient,
  useDeskproLatestAppContext,
} from "@deskpro/app-sdk";
import { setEntityService } from "../../services/deskpro";
import { createCardService } from "../../services/basecamp";
import { useAsyncError, useSetTitle, useLinkedAutoComment, useReplyBox } from "../../hooks";
import { entity } from "../../utils";
import { getCardValues, getCardMeta } from "../../components/CardForm";
import { CreateCard } from "../../components";
import type { FC } from "react";
import type { Maybe, TicketContext, CardMetaAsString } from "../../types";
import type { Account } from "../../services/basecamp/types";
import type { FormValidationSchema } from "../../components/CardForm";

const CreateCardPage: FC = () => {
  const navigate = useNavigate();
  const { client } = useDeskproAppClient();
  const { context } = useDeskproLatestAppContext() as { context: TicketContext };
  const { asyncErrorHandler } = useAsyncError();
  const { addLinkComment } = useLinkedAutoComment();
  const { setSelectionState } = useReplyBox();
  const [error, setError] = useState<Maybe<string|string[]>>(null);
  const ticketId = useMemo(() => get(context, ["data", "ticket", "id"]), [context]);

  const onNavigateToLink = useCallback(() => navigate("/cards/link"), [navigate]);

  const onCancel = useCallback(() => navigate("/home"), [navigate]);

  const onSubmit = useCallback((values: FormValidationSchema) => {
    if (!client || !ticketId || isEmpty(values)) {
      return Promise.resolve();
    }

    const { accountId, projectId, columnId } = getCardMeta(values);
    const data = getCardValues(values);

    if (!accountId || !projectId || !columnId) {
      return Promise.resolve();
    }

    return createCardService(client, accountId, projectId, columnId, data)
      .then((card) => {
        const entityId = entity.generateId({ id: accountId } as Account, card) as CardMetaAsString;
        return Promise.all([
          setEntityService(client, ticketId, entityId),
          addLinkComment({ accountId, projectId, cardId: card.id }),
          setSelectionState(entityId, true, "email"),
          setSelectionState(entityId, true, "note"),
        ])
      })
      .then(() => navigate("/home"))
      .catch((err) => {
        const error = get(err, ["data", "error", "error"]);

        if (error) {
          setError(error);
        } else {
          asyncErrorHandler(err);
        }
      })
  }, [client, ticketId, navigate, asyncErrorHandler, addLinkComment, setSelectionState]);

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
    <CreateCard
      error={error}
      onSubmit={onSubmit}
      onCancel={onCancel}
      onNavigateToLink={onNavigateToLink}
    />
  );
};

export { CreateCardPage };
