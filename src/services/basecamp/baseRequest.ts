import { isEmpty } from "lodash";
import { proxyFetch } from "@deskpro/app-sdk";
import { BASE_URL, placeholders } from "../../constants";
import { getQueryParams, retryUntilHavePagination } from "../../utils";
import { BasecampError } from "./BasecampError";
import type { Request } from "../../types";

const baseRequest: Request = async (client, {
  url,
  rawUrl,
  data = {},
  method = "GET",
  queryParams = {},
  headers: customHeaders,
  pagination = false,
}) => {
  const dpFetch = await proxyFetch(client);

  const baseUrl = rawUrl ? rawUrl : `${BASE_URL}${url}`;
  const params = getQueryParams(queryParams);

  const requestUrl = `${baseUrl}.json?${isEmpty(params) ? "": `${params}`}`;
  const options: RequestInit = {
    method,
    headers: {
      "Authorization": `Bearer ${placeholders.ACCESS_TOKEN}`,
      ...customHeaders,
    },
  };

  if (data instanceof FormData) {
    options.body = data;
  } else if (!isEmpty(data)) {
    options.body = JSON.stringify(data);
    options.headers = {
      "Content-Type": "application/json",
      ...options.headers,
    };
  }

  if (!pagination) {
    const res = await dpFetch(requestUrl, options);
    // Provide a detailed error message if the user's account is inactive.
    // Source: https://github.com/basecamp/bc3-api?tab=readme-ov-file#404-not-found
    if (res.status === 404) {
      const reason = res.headers.get("Reason");

      if (reason === "Account Inactive") {
        throw new BasecampError({
          status: 404,
          data: {
            status: 404,
            error: "Your Basecamp account is inactive. Please check your subscription or re-enable the account."
          },
        });
      } else {
        throw new BasecampError({
          status: 404,
          data: await res.json(),
        });
      }
    }

    if (res.status < 200 || res.status > 399) {
      throw new BasecampError({
        status: res.status,
        data: await res.json(),
      });
    }

    try {
      return await res.json();
    } catch (e) {
      return {};
    }
  } else {
    const retryFetch = retryUntilHavePagination(dpFetch, options);
    return await retryFetch(requestUrl);
  }
};

export { baseRequest };
