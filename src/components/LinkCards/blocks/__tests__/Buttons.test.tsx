import { cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { render } from "../../../../../testing";
import { Buttons } from "../Buttons";

describe("LinkCards", () => {
  describe("Buttons", () => {
    afterEach(() => {
      jest.clearAllMocks();
      cleanup();
    });

    test("render", async () => {
      const { findByRole } = render((
        <Buttons
          selectedCards={[]}
          onCancel={jest.fn()}
          onLinkCards={jest.fn()}
          isSubmitting={false}
        />
      ), { wrappers: { theme: true } });

      const linkButton = await findByRole("button", { name: "Link Cards" });
      const cancelButton = await findByRole("button", { name: "Cancel" });
      expect(linkButton).toBeInTheDocument();
      expect(cancelButton).toBeInTheDocument();
    });

    test("should click \"link cards\"", async () => {
      const onLinkCards = jest.fn();

      const { findByRole } = render((
        <Buttons
          selectedCards={[{} as never]}
          onCancel={jest.fn()}
          onLinkCards={onLinkCards}
          isSubmitting={false}
        />
      ), { wrappers: { theme: true }});

      const linkButton = await findByRole("button", { name: "Link Cards" });

      await userEvent.click(linkButton as Element);

      expect(onLinkCards).toBeCalledTimes(1);
    });

    test("should click \"Cancel\"", async () => {
      const mockOnCancel = jest.fn();

      const { findByRole } = render((
        <Buttons
          selectedCards={[]}
          onCancel={mockOnCancel}
          onLinkCards={jest.fn()}
          isSubmitting={false}
        />
      ), { wrappers: { theme: true }});

      const cancelButton = await findByRole("button", { name: "Cancel" });

      await userEvent.click(cancelButton as Element);

      expect(mockOnCancel).toBeCalledTimes(1);
    });
  });
});
