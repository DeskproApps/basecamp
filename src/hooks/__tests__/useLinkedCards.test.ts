import { cleanup, renderHook, waitFor } from "@testing-library/react";
import { useQueries } from "@tanstack/react-query";
import { getEntityListService } from "../../services/deskpro";
import { getCardService } from "../../services/basecamp";
import { useLinkedCards } from "../useLinkedCards";
import { wrap, mockCard } from "../../../testing";
import type { Result } from "../useLinkedCards";

jest.mock("../../services/deskpro/getEntityListService");
jest.mock("../../services/basecamp/getCardService");
jest.mock("../useQueriesWithClient", () => ({
  useQueriesWithClient: (queries: never[]) => useQueries({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    queries: queries?.map(({ queryFn, ...options }: any) => ({ queryFn, ...(options ?? {}) })),
  }),
}));

describe("useLinkedCards", () => {
  afterEach(() => {
    jest.clearAllMocks();
    cleanup();
  });

  test("shouldn't fetched cards via api if no linked cards to the ticket", async () => {
    (getEntityListService as jest.Mock).mockResolvedValueOnce([]);
    (getCardService as jest.Mock).mockResolvedValueOnce(mockCard);

    renderHook<Result, unknown>(() => useLinkedCards(), {
      wrapper: ({ children }) => wrap(children, { query: true }),
    });

    await waitFor(() => {
      expect(getEntityListService).toHaveBeenCalled();
      expect(getCardService).toHaveBeenCalledTimes(0);
    });
  });

  test("should return linked cards", async () => {
    (getEntityListService as jest.Mock).mockResolvedValueOnce(["101/102/6507640630"]);
    (getCardService as jest.Mock).mockResolvedValueOnce(mockCard);

    const { result } = renderHook<Result, unknown>(() => useLinkedCards(), {
      wrapper: ({ children }) => wrap(children, { query: true }),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBeFalsy();
      expect(result.current.cardsMeta).toEqual(["101/102/6507640630"]);
      expect(result.current.cards).toStrictEqual([mockCard]);
    });
  });
});
