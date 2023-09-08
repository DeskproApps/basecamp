import { cleanup } from "@testing-library/react";
import { render, mockCard, mockAuthInfo, mockProjects } from "../../../../testing";
import { CardItem } from "../CardItem";

jest.mock("../../common/DeskproTickets/DeskproTickets", () => ({
  DeskproTickets: () => <>100500</>,
}));

describe("CardItem", () => {
  afterEach(() => {
    jest.clearAllMocks();
    cleanup();
  });

  test("render", async () => {
    const { findByText, findAllByText } = render((
      <CardItem
        card={mockCard as never}
        projects={mockProjects as never}
        account={mockAuthInfo.accounts[0] as never}
      />
    ), { wrappers: { theme: true } });

    expect(await findByText(/Research/i)).toBeInTheDocument();
    expect(await findAllByText(/Deskpro/i)).toHaveLength(3);
    expect(await findByText(/In progress/i)).toBeInTheDocument();
    expect(await findByText(/01 Sep, 2023/i)).toBeInTheDocument();
    expect(await findByText(/100500/i)).toBeInTheDocument();
  });
});
