import pick from "lodash/pick";
import { getCardValues } from "../utils";
import mockValues from "./mockValues.json";

describe("CardForm", () => {
  describe("getCardValues", () => {
    test("should return required values ", () => {
      expect(getCardValues(pick(mockValues, ["title"]) as never))
        .toEqual({ title: "Test Card" });
    });

    test("should return full card values", () => {
      expect(getCardValues(mockValues as never)).toEqual({
        title: "Test Card",
        content: "<p>this is description</p>",
        due_on: "2023-09-29",
        assignee_ids: [44506585, 44506648],
      });
    });
  });
});
