import { FC, useState } from 'react';
import styled from "styled-components";
import { P1 } from "@deskpro/deskpro-ui";
import {
  LoadingSpinner,
  CopyToClipboardInput,
  useInitialisedDeskproAppClient,
  useDeskproLatestAppContext
} from "@deskpro/app-sdk";
import { getQueryParams } from '../../utils';
import { AUTH_URL } from '../../constants';
import type { Maybe, Settings } from '../../types';

const Description = styled(P1)`
  margin-top: 8px;
  margin-bottom: 16px;
  color: ${({ theme }) => theme.colors.grey80};
`;

export const AdminCallback: FC<{ callbackUrl?: Maybe<string> }> = ({ callbackUrl }) => {
  if (!callbackUrl) {
    return (<LoadingSpinner/>);
  }

  return (
    <>
      <CopyToClipboardInput value={callbackUrl} />
      <Description>The callback URL will be required during Basecamp app setup</Description>
    </>
  );
};

const AdminCallbackPage: FC = () => {
  const { context } = useDeskproLatestAppContext<unknown, Settings>();
  const [callbackUrl, setCallbackUrl] = useState<string|null>(null);

  useInitialisedDeskproAppClient(client => {
    const clientID = context?.settings.client_id;

    client.startOauth2Local(
      ({ callbackUrl, state }) => {
        setCallbackUrl(callbackUrl);

        return `${AUTH_URL}/new?${getQueryParams({
          type: 'web_server',
          client_id: clientID ?? '',
          state,
          redirect_uri: callbackUrl
        })}`;
      },
      /code=(?<code>[0-9a-f]+)/,
      async () => ({data: {access_token: ''}}),
      {
        pollInterval: 10000,
        timeout: 600
      }
    );
  }, []);

  return (
    <AdminCallback callbackUrl={callbackUrl} />
  );
};

export { AdminCallbackPage };