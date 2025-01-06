import { get, concat } from "lodash";
import { updatePaginationUrl } from "../utils";
import type { Fetch } from "@deskpro/app-sdk";

type PromiseCallback<T> = (url: string) => Promise<T>;

const retryUntilHavePagination = <T>(
  dpFetch: Fetch,
  options: RequestInit,
) => {
  return (requestUrl: string): Promise<T[]> => {
    let result: T[] = [];
    let nextPage = 1;

    const run: PromiseCallback<T[]> = async (url) => {
      const res = await dpFetch(url, options);
      // @see https://github.com/basecamp/bc3-api/blob/master/README.md#pagination
      const link = get(res, ["headers", "link", 0]);
      const data = await res.json();
      result = concat(result, data);

      if (link) {
        nextPage = nextPage + 1;
        return run(updatePaginationUrl(url));
      }

      return result;
    };

    return run(requestUrl);
  }
};

export { retryUntilHavePagination };
