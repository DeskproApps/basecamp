import { cleanup } from "@testing-library/react";
import { render, mockCard } from "../../../../../testing";
import { Steps } from "../Steps";

describe("ViewCard", () => {
  describe("Steps", () => {
    afterEach(() => {
      jest.clearAllMocks();
      cleanup();
    });

    test("render", async () => {
      const { findByText } = render((
        <Steps card={mockCard as never} onChangeStepComplete={jest.fn()}/>
      ), { wrappers: { theme: true } });

      expect(await findByText(/Steps/i)).toBeInTheDocument();
      expect(await findByText(/Create stories/i)).toBeInTheDocument();
      expect(await findByText(/Figure out what the Basecamp/i)).toBeInTheDocument();
      expect(await findByText(/Figure out the API of the Basecamp/i)).toBeInTheDocument();
      expect(await findByText(/Create repository/i)).toBeInTheDocument()
      expect(await findByText(/Init app \(manifest.json, logo, Router, react-query, ErrorBoundary\)/i)).toBeInTheDocument();
    });

    test.todo("should change step status");
  });
});
