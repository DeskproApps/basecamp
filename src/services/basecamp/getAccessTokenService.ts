import { baseRequest } from "./baseRequest";
import { AUTH_URL, placeholders } from "../../constants";
import type { IDeskproClient } from "@deskpro/app-sdk";
import type { AccessToken } from "./types";

const getAccessTokenService = (
    client: IDeskproClient,
    code: string,
    redirectUri: string
) => {
  return baseRequest<AccessToken>(client, {
    rawUrl: `${AUTH_URL}/token`,
    method: "POST",
    queryParams: {
      type: "web_server",
      code,
      redirect_uri: redirectUri,
      client_id: placeholders.CLIENT_ID,
      client_secret: placeholders.CLIENT_SECRET,
    },
  });
};

export { getAccessTokenService };
