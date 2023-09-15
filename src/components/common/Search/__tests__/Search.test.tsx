import get from "lodash/get";
import { cleanup, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Search } from "../Search";
import { render } from "../../../../../testing";
import type { Props } from "../Search";

const renderSearch = (props?: Partial<Props>) => render((
  <Search
    label={get(props, "label")}
    onChange={get(props, "onChange", jest.fn())}
    disabled={get(props, "disabled", false)}
    required={get(props, "required", false)}
    isFetching={get(props, "isFetching", false)}
  />
), { wrappers: { theme: true } });

describe("Search", () => {
  afterEach(() => {
    jest.clearAllMocks();
    cleanup();
  });

  test("render", async () => {
    const { container } = renderSearch();

    const input = container.querySelector("input#search");
    expect(input).toBeInTheDocument();
  });

  test("should called onChange", async () => {
    const onChange = jest.fn();
    const { container } = renderSearch({ onChange });

    const input = container.querySelector("input#search");
    expect(input).toBeInTheDocument();

    await act(async () => {
      await userEvent.type(input as Element, "search entity");
    });

    expect(onChange).toHaveBeenCalled();
  });

  test("should reset search", async () => {
    const { container } = renderSearch();

    const input = container.querySelector("input#search") as HTMLInputElement;
    const resetButton = container.querySelector("[data-testid=\"search-reset\"]");

    await act(async () => {
      await userEvent.type(input as Element, "search entity");
    });

    expect(input.value).toBe("search entity");

    await act(async () => {
      await userEvent.click(resetButton as Element);
    });

    expect(input.value).toBe("");
  });
});
