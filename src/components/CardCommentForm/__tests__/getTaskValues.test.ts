import { getValues } from "../utils";

describe("CardCommentForm", () => {
  describe("getValues", () => {
    test("should return comment values", () => {
      expect(getValues({ comment: "test comment" } as never))
        .toEqual({ content: "<p>test comment</p>" });
    });
  });
});
