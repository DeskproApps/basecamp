import { cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { render } from "../../../../testing";
import { LinkCards } from "../LinkCards";

describe("LinkCards", () => {
  afterEach(() => {
    jest.clearAllMocks();
    cleanup();
  });

  test("should navigate to \"create card\" page", async () => {
    const mockOnNavigateToCreate = jest.fn();

    const { findByRole } = render((
      <LinkCards
        selectedAccount={0}
        accounts={[]}
        onChangeAccount={jest.fn()}
        isLoading={false}
        isSubmitting={false}
        cardTables={[]}
        selectedCardTable={0}
        onChangeCardTable={jest.fn()}
        selectedCards={[]}
        onLinkCards={jest.fn()}
        onCancel={jest.fn()}
        cards={[]}
        onChangeSelectedCard={jest.fn()}
        account={undefined}
        projects={[]}
        onNavigateToCreate={mockOnNavigateToCreate}
      />
    ), { wrappers: { theme: true, query: true } });

    const createButton = await findByRole("button", { name: "Create Card" });
    await userEvent.click(createButton);

    expect(mockOnNavigateToCreate).toHaveBeenCalled();
  });
});
