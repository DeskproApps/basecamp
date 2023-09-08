import { cleanup } from "@testing-library/react";
import { render, mockCardComments } from "../../../../../testing";
import { Comments } from "../Comments";

jest.mock('react-time-ago', () => jest.fn().mockReturnValue('7h 30m'));

describe("ViewCard", () => {
  describe("Comments", () => {
    afterEach(() => {
      jest.clearAllMocks();
      cleanup();
    });

    test("render", async () => {
      const { findByText } = render((
        <Comments comments={mockCardComments as never[]}/>
      ), { wrappers: { theme: true }});

      expect(await findByText(/Comments \(2\)/i)).toBeInTheDocument();
      expect(await findByText(/First comment/i)).toBeInTheDocument();
      expect(await findByText(/Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat/i)).toBeInTheDocument();
    });
  });
});
