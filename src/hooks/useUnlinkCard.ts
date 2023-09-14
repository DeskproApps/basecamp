import { useState, useMemo, useCallback } from "react";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import { useNavigate } from "react-router-dom";
import {
  useDeskproAppClient,
  useDeskproLatestAppContext,
} from "@deskpro/app-sdk";
import { deleteEntityService } from "../services/deskpro";
import { useAsyncError } from "./useAsyncError";
import { useLinkedAutoComment } from "./useLinkedAutoComment";
import { entity } from "../utils";
import type { CardMeta, TicketContext } from "../types";
import type { Card, Account } from "../services/basecamp/types";

type Params = { card?: Card, meta?: CardMeta };

export type Result = {
  isLoading: boolean,
  unlink: (params?: Params) => void,
};

const useUnlinkCard = (): Result => {
  const navigate = useNavigate();
  const { client } = useDeskproAppClient();
  const { context } = useDeskproLatestAppContext() as { context: TicketContext };
  const { addUnlinkComment } = useLinkedAutoComment();
  const { asyncErrorHandler } = useAsyncError();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const ticketId = useMemo(() => get(context, ["data", "ticket", "id"]), [context]);

  const unlink = useCallback(({ card, meta }: Params = {}) => {
    const accountId = get(meta, ["accountId"]);
    const entityId = entity.generateId({ id: accountId } as Account, card);

    if (!client || isEmpty(card) || !entityId) {
      return;
    }

    setIsLoading(true);

    Promise.all([
      deleteEntityService(client, ticketId, entityId),
      addUnlinkComment(meta),
    ])
      .then(() => {
        setIsLoading(false);
        navigate("/home");
      })
      .catch(asyncErrorHandler);
  }, [client, ticketId, navigate, asyncErrorHandler, addUnlinkComment]);

  return { isLoading, unlink };
};

export { useUnlinkCard };
