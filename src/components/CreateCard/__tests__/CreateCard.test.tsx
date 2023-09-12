import { cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { render } from "../../../../testing";
import { CreateCard } from "../CreateCard";

describe("CreateCard", () => {
  afterEach(() => {
    jest.clearAllMocks();
    cleanup();
  });

  test("should navigate to \"link card\" page", async () => {
    const mockOnNavigateToLink = jest.fn();

    const { findByRole } = render((
      <CreateCard onSubmit={jest.fn()} onNavigateToLink={mockOnNavigateToLink} />
    ), { wrappers: { theme: true, query: true } });

    const findButton = await findByRole("button", { name: "Find Card" });
    await userEvent.click(findButton);

    expect(mockOnNavigateToLink).toHaveBeenCalled();
  });
});
