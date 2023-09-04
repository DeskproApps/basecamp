import { baseRequest } from "./baseRequest";
import { AUTH_URL } from "../../constants";
import type { IDeskproClient } from "@deskpro/app-sdk";
import type { AuthInfo } from "./types";

const getAuthInfoService = (client: IDeskproClient) => {
  return baseRequest<AuthInfo>(client, {
    rawUrl: AUTH_URL,
    method: "POST",
  });
};

export { getAuthInfoService };
