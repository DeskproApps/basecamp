import get from "lodash/get";
import { cleanup } from "@testing-library/react";
import { render, mockAuthInfo } from "../../../../testing";
import { getAuthInfoService } from "../../../services/basecamp";
import { CardForm } from "../CardForm";
import type { Props } from "../types";

jest.mock("../../../services/basecamp/getAuthInfoService");

const renderCardForm = (props?: Partial<Props>) => render((
  <CardForm
    onSubmit={get(props, ["onSubmit"], jest.fn())}
    onCancel={get(props, ["onCancel"], jest.fn())}
    isEditMode={get(props, ["isEditMode"], false)}
    error={get(props, ["error"], null)}
  />
), { wrappers: { theme: true, query: true } });

describe("CardForm", () => {
  afterEach(() => {
    jest.clearAllMocks();
    cleanup();
  });

  (getAuthInfoService as jest.Mock).mockResolvedValue(mockAuthInfo);

  test("render", async () => {
    const { findByText } = renderCardForm();

    expect(await findByText(/Account/i)).toBeInTheDocument();
    expect(await findByText(/Project/i)).toBeInTheDocument();
    expect(await findByText(/Card Table/i)).toBeInTheDocument();
    expect(await findByText(/Column/i)).toBeInTheDocument();
    expect(await findByText(/Title/i)).toBeInTheDocument();
    expect(await findByText(/Assign card/i)).toBeInTheDocument();
    expect(await findByText(/Due on/i)).toBeInTheDocument();
    expect(await findByText(/Description/i)).toBeInTheDocument();
  });

  test("should show \"Create\" button", async () => {
    const { findByRole } = renderCardForm();
    const createButton = await findByRole("button", { name: "Create" });
    expect(createButton).toBeInTheDocument();
  });

  test("should show \"Save\" button", async () => {
    const { findByRole } = renderCardForm({ isEditMode: true });
    const saveButton = await findByRole("button", { name: "Save" });
    expect(saveButton).toBeInTheDocument();
  });

  test("render error", async () => {
    const { findByText } = renderCardForm({ error: "some error" });
    expect(await findByText(/some error/)).toBeInTheDocument();
  });
});
