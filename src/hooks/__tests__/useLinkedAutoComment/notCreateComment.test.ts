import { cleanup, renderHook, act } from "@testing-library/react";
import { createCardCommentService } from "../../../services/basecamp";
import { useLinkedAutoComment } from "../../useLinkedAutoComment";
import type { Result } from "../../useLinkedAutoComment";

jest.mock("../../../services/basecamp/createCardCommentService");

jest.mock("@deskpro/app-sdk", () => ({
  ...jest.requireActual("@deskpro/app-sdk"),
  useDeskproLatestAppContext: () => ({
    context: {
      settings: { add_comment_when_linking: false },
      data: {
        ticket: { id: "215", subject: "Big ticket", permalinkUrl: "https://permalink.url" },
      },
    },
  }),
}));

const mockCardMeta = { accountId: 101, projectId: 201, cardId: 6507640630 };

describe("useAutoCommentLinkedIssue", () => {
  afterEach(() => {
    jest.clearAllMocks();
    cleanup();
  });

  test("shouldn't to called the service to create an automatic comment (link issue)", async () => {
    (createCardCommentService as jest.Mock).mockResolvedValueOnce(() => Promise.resolve());

    const { result } = renderHook<Result, unknown>(() => useLinkedAutoComment());

    await act(async () => {
      await result.current.addLinkComment(mockCardMeta);
    });

    expect(createCardCommentService).not.toHaveBeenCalled();
  });

  test("shouldn't to called the service to create an automatic comment (unlink issue)", async () => {
    (createCardCommentService as jest.Mock).mockResolvedValueOnce(() => Promise.resolve());

    const { result } = renderHook<Result, unknown>(() => useLinkedAutoComment());

    await act(async () => {
      await result.current.addUnlinkComment(mockCardMeta);
    });

    expect(createCardCommentService).not.toHaveBeenCalled();
  });
});
