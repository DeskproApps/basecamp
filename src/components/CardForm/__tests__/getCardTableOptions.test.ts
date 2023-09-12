import { getCardTableOptions } from "../utils";
import { mockProjects } from "../../../../testing";

describe("CardForm", () => {
  describe("getCardTableOptions", () => {
    test("should return card table options", () => {
      expect(getCardTableOptions(201 as never, mockProjects as never[])).toStrictEqual([
        { type: "value", key: "6507629791", value: 6507629791, label: "Card Table" },
        { type: "value", key: "6508451645", value: 6508451645, label: "Test Card Table" },
      ]);

      expect(getCardTableOptions(202, mockProjects as never)).toStrictEqual([
        { type: "value", key: "6507614027", value: 6507614027, label: "Starting Card Table" },
      ]);
    });

    test("should return empty array of options", () => {
      expect(getCardTableOptions(undefined, mockProjects as never)).toEqual([]);
      expect(getCardTableOptions(201, [])).toEqual([]);
    });

    test.each(
      [undefined, null, "", 0, true, false, {}, []]
    )("wrong value %p", (value) => {
      expect(getCardTableOptions(201, value as never)).toStrictEqual([]);
    });
  });
});
