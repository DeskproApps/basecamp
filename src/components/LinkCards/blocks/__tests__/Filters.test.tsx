import get from "lodash/get";
import { cleanup, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { render, mockAuthInfo } from "../../../../../testing";
import { Filters } from "../Filters";
import type { Props } from "../Filters";

const renderFilters = (props?: Props) => render((
  <Filters
    accounts={get(props, "accounts", [])}
    cardTables={get(props, "cardTables", [])}
    selectedAccount={get(props, "selectedAccount", null)}
    onChangeAccount={get(props, "onChangeAccount", jest.fn())}
    selectedCardTable={get(props, "selectedCardTable", null)}
    onChangeCardTable={get(props, "onChangeCardTable", jest.fn())}
  />
), { wrappers: { theme: true }});

describe("LinkCards", () => {
  describe("Filters", () => {
    beforeAll(() => {
      window.HTMLElement.prototype.scrollTo = jest.fn();
    });

    afterEach(() => {
      jest.clearAllMocks();
      cleanup();
    });

    test("render", async () => {
      const { findByText } = renderFilters();

      expect(await findByText(/Account/i)).toBeInTheDocument();
      expect(await findByText(/Card Table/i)).toBeInTheDocument();
    });

    describe("account select", () => {
      test("should show no \"No account(s) found\" if no accounts", async () => {
        const { container, findByText } = renderFilters();

        const accountSelect = container.querySelector('#account');

        await act(async () => {
          await userEvent.click(accountSelect as Element);
        });

        expect(await findByText(/No account\(s\) found/i)).toBeInTheDocument();
      });

      test("should show accounts list", async () => {
        const { findByText, container } = renderFilters({
          accounts: mockAuthInfo.accounts,
        } as never);

        const accountSelect = container.querySelector('#account');

        await act(async () => {
          await userEvent.click(accountSelect as Element);
        });

        expect(await findByText(/Deskpro/i)).toBeInTheDocument();
        expect(await findByText(/Self-owned/i)).toBeInTheDocument();
      });
    });

    describe("card table select", () => {
      test("should show no \"No account(s) found\" if no accounts", async () => {
        const { container, findByText } = renderFilters();

        const cardTableSelect = container.querySelector('#cardTable');

        await act(async () => {
          await userEvent.click(cardTableSelect as Element);
        });

        expect(await findByText(/No card table\(s\) found/i)).toBeInTheDocument();
      });

      test("should show cardTables list", async () => {
        const { findByText, container } = renderFilters({
          cardTables: [
            { id: 101, name: "project one", cardTables: [{ id: 201, name: "table one" }, { id: 202, name: "table two" }] },
            { id: 102, name: "project two", cardTables: [{ id: 203, name: "table three" }] },
          ],
        } as never);

        const cardTableSelect = container.querySelector('#cardTable');

        await act(async () => {
          await userEvent.click(cardTableSelect as Element);
        });

        expect(await findByText(/project one/i)).toBeInTheDocument();
        expect(await findByText(/table one/i)).toBeInTheDocument();
        expect(await findByText(/table two/i)).toBeInTheDocument();
        expect(await findByText(/project two/i)).toBeInTheDocument();
        expect(await findByText(/table three/i)).toBeInTheDocument();
      });
    });
  });
});
