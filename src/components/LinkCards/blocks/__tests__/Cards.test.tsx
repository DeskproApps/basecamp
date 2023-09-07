import { cleanup } from "@testing-library/react";
import { render, mockCards, mockProjects, mockAuthInfo } from "../../../../../testing";
import { Cards } from "../Cards";

describe("LinkCards", () => {
  describe("Cards", () => {
    afterEach(() => {
      jest.clearAllMocks();
      cleanup();
    });

    test("render", async () => {
      const { findByText } = render((
        <Cards
          cards={mockCards as never[]}
          isLoading={false}
          projects={mockProjects as never[]}
          account={mockAuthInfo.accounts[0] as never}
          selectedCards={[]}
          onChangeSelectedCard={jest.fn()}
        />
      ), { wrappers: { theme: true }});

      expect(await findByText(/Research/i)).toBeInTheDocument();
    });

    test("should show \"No found\" id wrong cards", async () => {
      const { findByText } = render((
        <Cards
          cards={{} as never}
          isLoading={false}
          projects={mockProjects as never[]}
          account={mockAuthInfo.accounts[0] as never}
          selectedCards={[]}
          onChangeSelectedCard={jest.fn()}
        />
      ), { wrappers: { theme: true }});

      expect(await findByText(/No found/i)).toBeInTheDocument();
    });

    test("should show \"No Basecamp cards found\" if no cards", async () => {
      const { findByText } = render((
        <Cards
          cards={[]}
          isLoading={false}
          projects={mockProjects as never[]}
          account={mockAuthInfo.accounts[0] as never}
          selectedCards={[]}
          onChangeSelectedCard={jest.fn()}
        />
      ), { wrappers: { theme: true }});

      expect(await findByText(/No Basecamp cards found/i)).toBeInTheDocument();
    });
  });
});
