import { cleanup, renderHook, waitFor } from "@testing-library/react";
import { useNavigate } from "react-router-dom";
import { getEntityListService } from "../../../services/deskpro";
import { getAuthInfoService } from "../../../services/basecamp";
import { useCheckAuth } from "../hooks";
import { mockAuthInfo } from "../../../../testing";

jest.mock("../../../services/deskpro/getEntityListService");
jest.mock("../../../services/basecamp/getAuthInfoService");

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

describe("useCheckAuth", () => {
  afterEach(() => {
    jest.clearAllMocks();
    cleanup();
  });

  test("should navigate to \"LinkCard\" page", async () => {
    const mockNavigate = jest.fn();
    (useNavigate as jest.Mock).mockImplementation(() => mockNavigate);
    (getEntityListService as jest.Mock).mockResolvedValueOnce([]);
    (getAuthInfoService as jest.Mock).mockResolvedValueOnce(mockAuthInfo);

    renderHook(() => useCheckAuth());

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/cards/link");
    });
  });

  test("should navigate to \"Home\" page", async () => {
    const mockNavigate = jest.fn();
    (useNavigate as jest.Mock).mockImplementation(() => mockNavigate);
    (getEntityListService as jest.Mock).mockResolvedValueOnce(["101/102/6507640630"]);
    (getAuthInfoService as jest.Mock).mockResolvedValueOnce(mockAuthInfo);

    renderHook(() => useCheckAuth());

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/home");
    });
  });

  test("should navigate to \"Login\" page", async () => {
    const mockNavigate = jest.fn();
    (useNavigate as jest.Mock).mockImplementation(() => mockNavigate);
    (getEntityListService as jest.Mock).mockResolvedValueOnce(["101/102/6507640630"]);
    (getAuthInfoService as jest.Mock).mockRejectedValueOnce("");

    renderHook(() => useCheckAuth());

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/login");
    });
  });
3});
