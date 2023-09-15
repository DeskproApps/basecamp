import { cleanup } from "@testing-library/react";
import { render, mockCard, mockAuthInfo, mockProjects } from "../../../../../testing";
import { Details } from "../Details";

jest.mock("../../../common/DeskproTickets/DeskproTickets", () => ({
  DeskproTickets: () => <>100500</>,
}));

describe("ViewCard", () => {
  describe("Details", () => {
    afterEach(() => {
      jest.clearAllMocks();
      cleanup();
    });

    test("render", async () => {
      const { findByText, findAllByText } = render((
        <Details
          card={mockCard as never}
          account={mockAuthInfo.accounts[0] as never}
          project={mockProjects[0] as never}
        />
      ), { wrappers: { theme: true } });

      expect(await findByText(/Research/i)).toBeInTheDocument();
      expect(await findAllByText(/Deskpro/i)).toHaveLength(4);
      expect(await findByText(/In progress/i)).toBeInTheDocument();
      expect(await findByText(/David A./i)).toBeInTheDocument();
      expect(await findByText(/Taras Shevchenko/i)).toBeInTheDocument();
      expect(await findByText(/01 Sep, 2023/i)).toBeInTheDocument();
      expect(await findByText(/09 Oct, 2023/i)).toBeInTheDocument();
      expect(await findByText(/100500/i)).toBeInTheDocument();
      expect(await findByText(/Note \/ Description/i)).toBeInTheDocument();
    });
  });
});
