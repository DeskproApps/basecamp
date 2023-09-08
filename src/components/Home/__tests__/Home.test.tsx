import get from "lodash/get";
import { cleanup } from "@testing-library/react";
import { render, mockCards } from "../../../../testing";
import { Home } from "../Home";
import type { Props } from "../Home";

jest.mock("../../common/DeskproTickets/DeskproTickets", () => ({
  DeskproTickets: () => <>100500</>,
}));

const renderHome = (props?: Props) => render((
  <Home
    cards={get(props, "cards", mockCards) as never}
    cardsMeta={get(props, "cardsMeta", [])}
    projects={get(props, "projects", [])}
    accounts={get(props, "accounts", [])}
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

  test.todo("should navigate to card details page");
});
