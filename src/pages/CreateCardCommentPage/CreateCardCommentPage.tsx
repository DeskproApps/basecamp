import { useState, useMemo, useCallback } from "react";
import get from "lodash/get";
import { createSearchParams, useNavigate, useSearchParams } from "react-router-dom";
import { useDeskproAppClient, useDeskproElements } from "@deskpro/app-sdk";
import { useSetTitle, useAsyncError } from "../../hooks";
import { createCardCommentService } from "../../services/basecamp";
import { getValues } from "../../components/CardCommentForm";
import { CreateCardComment } from "../../components";
import type { FormValidationSchema } from "../../components/CardCommentForm";
import type { FC } from "react";
import type { Maybe, CardMeta } from "../../types";

const CreateCardCommentPage: FC = () => {
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
  const [error, setError] = useState<Maybe<string|string[]>>(null);

  const onCancel = useCallback(() => {
    navigate({
      pathname: "/cards/view",
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore - react-router wants there to be a `string`, but here a `number`
      search: `?${createSearchParams(cardMeta)}`,
    });
  }, [navigate, cardMeta]);

  const onSubmit = useCallback((values: FormValidationSchema) => {
    const { accountId, projectId, cardId } = cardMeta;

    if (!client || !accountId || !projectId || !cardId) {
      return Promise.resolve();
    }

    return createCardCommentService(client, accountId, projectId, cardId, getValues(values))
      .then(() => navigate({
        pathname: "/cards/view",
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
      })
  }, [client, cardMeta, navigate, asyncErrorHandler]);

  useSetTitle("Comment");

  useDeskproElements(({ clearElements, registerElement }) => {
    clearElements();
    registerElement("refresh", { type: "refresh_button" });
    registerElement("home", {
      type: "home_button",
      payload: { type: "changePage", path: "/home" },
    });
  });

  return (
    <CreateCardComment
      error={error}
      onSubmit={onSubmit}
      onCancel={onCancel}
    />
  );
};

export { CreateCardCommentPage };
