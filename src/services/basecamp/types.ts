import type { DateTime } from "../../types";

export type Response<T> = Promise<T>;

export type BasecampAPIError = {
  status: number,
  error: string,
};

export type AccessToken = {
  expires_in: number,
  access_token: string,
  refresh_token: string,
};

export type Account = {
  id: number,
  name: string,
  product: string,
  href: string, // api href
  app_href: string, // web href
  hidden: false
};

export type AuthInfo = {
  expires_at: DateTime,
  identity: {
    id: number,
    email_address: string,
    first_name: string,
    last_name: string,
  },
  accounts: Account[],
};
