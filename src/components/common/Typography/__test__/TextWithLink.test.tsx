import { cleanup } from "@testing-library/react";
import { TextWithLink } from "../TextWithLink";
import { render } from "../../../../../testing";

describe("TextWithLink", () => {
  afterEach(() => {
    jest.clearAllMocks();
    cleanup();
  });

  test("render", async () => {
    const { getByText, container } = render((
      <TextWithLink text="link text" link="https://test.link" />
    ), { wrappers: { theme: true } });

    const linkIcon = container.querySelector(`a[href="https://test.link"]`);

    expect(linkIcon).toBeInTheDocument();
    expect(getByText(/link text/i)).toBeInTheDocument();
  });

  test("shouldn't show IconLink if the link is not passing", async () => {
    const { getByText, container } = render((
      <TextWithLink text="link text"/>
    ), { wrappers: { theme: true } });

    const linkIcon = container.querySelector(`a[href="https://test.link"]`);

    expect(linkIcon).not.toBeInTheDocument();
    expect(getByText(/link text/i)).toBeInTheDocument();
  });
});
