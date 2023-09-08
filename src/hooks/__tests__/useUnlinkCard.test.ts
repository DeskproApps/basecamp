import { cleanup, renderHook, act } from "@testing-library/react";
import { useNavigate } from "react-router-dom";
import { deleteEntityService } from "../../services/deskpro";
import { useUnlinkCard } from "../useUnlinkCard";
import { mockCard } from "../../../testing";
import type { Result } from "../useUnlinkCard";

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));
jest.mock("../useAsyncError", () => ({
  useAsyncError: jest.fn().mockReturnValue({ asyncErrorHandler: jest.fn() }),
}));
jest.mock("../../services/deskpro/deleteEntityService");

const payload = {
  type: "unlink",
  card: mockCard,
  meta: { accountId: 101, projectId: 201, cardId: mockCard.id },
}

describe("useUnlinkCard", () => {
  afterEach(() => {
    jest.clearAllMocks();
    cleanup();
  });

  test("should unlink card", async () => {
    const mockNavigate = jest.fn();
    (useNavigate as jest.Mock).mockImplementation(() => mockNavigate);
    (deleteEntityService as jest.Mock).mockResolvedValueOnce(undefined);

    const { result } = renderHook<Result, unknown>(() => useUnlinkCard());

    await act(async () => {
      await result.current.unlink(payload as never);
    })

    expect(deleteEntityService).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith("/home");
  });

  test("shouldn't navigate to /home if unlink card failed", async () => {
    const mockNavigate = jest.fn();
    (useNavigate as jest.Mock).mockImplementation(() => mockNavigate);
    (deleteEntityService as jest.Mock).mockRejectedValueOnce(new Error("unlink failed"));

    const { result } = renderHook<Result, unknown>(() => useUnlinkCard());

    await act(async () => {
      await result.current.unlink(payload as never);
    });

    expect(deleteEntityService).toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalledWith("/home");
  });

  test("shouldn't navigate to /home if no card", async () => {
    const mockNavigate = jest.fn();
    (useNavigate as jest.Mock).mockImplementation(() => mockNavigate);
    (deleteEntityService as jest.Mock).mockResolvedValueOnce(undefined);

    const { result } = renderHook<Result, unknown>(() => useUnlinkCard());

    await act(async () => {
      await result.current.unlink();
    });

    expect(deleteEntityService).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalledWith("/home");
  });
});
