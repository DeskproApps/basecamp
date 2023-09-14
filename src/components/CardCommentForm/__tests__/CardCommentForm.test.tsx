import get from "lodash/get";
import { cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { render } from "../../../../testing";
import { CardCommentForm } from "../CardCommentForm";
import type { Props } from "../types";

const renderCardCommentForm = (props?: Partial<Props>) => render((
  <CardCommentForm
    onSubmit={get(props, ["onSubmit"], jest.fn())}
    onCancel={get(props, ["onCancel"], jest.fn())}
    error={get(props, ["error"], null)}
  />
), { wrappers: { theme: true } });

describe("CardCommentForm", () => {
  afterEach(() => {
    jest.clearAllMocks();
    cleanup();
  });

  test("render", async () => {
    const { findByText } = renderCardCommentForm();

    expect(await findByText("New comment")).toBeInTheDocument();
    expect(await findByText("Add")).toBeVisible();
    expect(await findByText("Cancel")).toBeVisible();
  });

  test("should should navigate to task details", async () => {
    const mockOnCancel = jest.fn();

    const { findByRole } = renderCardCommentForm({ onCancel: mockOnCancel });

    const cancelButton = await findByRole("button", { name: /Cancel/i });

    await userEvent.click(cancelButton);

    expect(mockOnCancel).toHaveBeenCalled();
  });

  test("render error", async () => {
    const { findByText } = renderCardCommentForm({ error: "some error" })
    expect(await findByText("some error")).toBeInTheDocument();
  });
});
