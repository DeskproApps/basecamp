import { useState, useCallback, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import get from "lodash/get";
import size from "lodash/size";
import {
  useDeskproLatestAppContext,
  useInitialisedDeskproAppClient,
} from "@deskpro/app-sdk";
import {
  getEntityListService,
  setAccessTokenService,
} from "../../services/deskpro";
import {
  getAccessTokenService, getAuthInfoService,
} from "../../services/basecamp";
import { getQueryParams } from "../../utils";
import { AUTH_URL, DEFAULT_ERROR, GLOBAL_CLIENT_ID } from "../../constants";
import type { Maybe, Settings } from "../../types";

export type Result = {
  onLogIn: () => void,
  authUrl: string,
  error: Maybe<string>,
  isLoading: boolean,
};

const useLogin = (): Result => {
  const callbackURLRef = useRef('');
  const navigate = useNavigate();
  const [error, setError] = useState<Maybe<string>>(null);
  const [authUrl, setAuthUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { context } = useDeskproLatestAppContext<unknown, Settings>();
  const ticketId = useMemo(() => get(context, ["data", "ticket", "id"]), [context]);

  useInitialisedDeskproAppClient(async client => {
    if (context?.settings.use_deskpro_saas === undefined) {
      return;
    };

    const clientID = context.settings.client_id;
    const mode = context?.settings.use_deskpro_saas ? 'global' : 'local';

    if (mode === 'local' && typeof clientID !== 'string') {
      return;
    };

    const oauth2 = mode === 'global' ? await client.startOauth2Global(GLOBAL_CLIENT_ID) : await client.startOauth2Local(
      ({ callbackUrl, state }) => {
        callbackURLRef.current = callbackUrl;

        return `${AUTH_URL}/new?${getQueryParams({
          type: 'web_server',
          client_id: clientID,
          state,
          redirect_uri: callbackUrl
        })}`
      },
      /code=(?<code>[\d\w]+)/,
      async code => {
        const data = await getAccessTokenService(client, code, callbackURLRef.current);

        return { data };
      }
    );

    setAuthUrl(oauth2.authorizationUrl);
    setError(null);

    try {
      const pollResult = await oauth2.poll();

      await setAccessTokenService(client, pollResult.data.access_token);

      const authInfo = await getAuthInfoService(client);

      if (!authInfo.identity.id) {
        throw new Error('No Identity Found');
      };

      const entityIDs = await getEntityListService(client, ticketId);

      navigate(size(entityIDs) ? '/home' : '/cards/link');
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError(DEFAULT_ERROR);
      };
    } finally {
      setIsLoading(false);
    };
  }, []);

  const onLogIn = useCallback(() => {
    setIsLoading(true);
    window.open(authUrl, '_blank');
  }, [setIsLoading, authUrl]);

  return { authUrl, onLogIn, error, isLoading };
};

export { useLogin };
