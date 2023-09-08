import get from "lodash/get";
import { cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { render, mockCards, mockProjects, mockAuthInfo } from "../../../../testing";
import { Home } from "../Home";
import type { Props } from "../Home";

jest.mock("../../common/DeskproTickets/DeskproTickets", () => ({
  DeskproTickets: () => <>100500</>,
}));

const renderHome = (props?: Partial<Props>) => render((
  <Home
    cards={get(props, "cards", mockCards) as never}
    cardsMeta={get(props, "cardsMeta", [])}
    projects={get(props, "projects", [])}
    accounts={get(props, "accounts", [])}
    onNavigateToCard={get(props, ["onNavigateToCard"], jest.fn())}
  />
), { wrappers: { theme: true } });

describe("Home", () => {
  afterEach(() => {
    jest.clearAllMocks();
    cleanup();
  });

  test("render", async () => {
    const { findByText } = renderHome();
    expect(await findByText(/Research/i)).toBeInTheDocument();
  });

  test("should show \"No found\" if wrong cards", async () => {
    const { findByText } = renderHome({ cards: {} } as never);
    expect(await findByText(/No found/i)).toBeInTheDocument();
  });

  test("should show \"No Basecamp cards found\" if no cards", async () => {
    const { findByText } = renderHome({ cards: [] });
    expect(await findByText(/No Basecamp cards found/i)).toBeInTheDocument();
  });

  test("should navigate to card details page", async () => {
    const mockOnNavigateToCard = jest.fn();

    const { findByText } = renderHome({
      cardsMeta: [{ cardId: 6507640630, accountId: 101, projectId: 201 }],
      projects: mockProjects as never[],
      accounts: mockAuthInfo.accounts as never[],
      onNavigateToCard: mockOnNavigateToCard
    });

    const cardTitle = await findByText(/Research/i);
    expect(cardTitle).toBeInTheDocument();

    await userEvent.click(cardTitle as Element);

    expect(mockOnNavigateToCard).toHaveBeenCalled();
  });
});
