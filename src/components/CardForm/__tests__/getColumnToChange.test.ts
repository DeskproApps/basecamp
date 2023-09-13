import cloneDeep from "lodash/cloneDeep";
import { getColumnToChange } from "../utils";
import mockValues from "./mockValues.json";
import { mockCard } from "../../../../testing";

describe("CardForm", () => {
  describe("getColumnToChange", () => {
    test("should return column to change", () => {
      const card = cloneDeep(mockCard);
      card.parent.id = 303;

      const values = cloneDeep(mockValues);
      values.column = 303;

      expect(getColumnToChange(mockCard as never, values as never)).toEqual(303);
      expect(getColumnToChange(card as never, mockValues as never)).toEqual(6507629798);
    });

    test("shouldn't return column if it's not changed", () => {
      expect(getColumnToChange(mockCard as never, mockValues as never)).toBeUndefined();
    });

    test("shouldn't return column if no passing card or values", () => {
      expect(getColumnToChange()).toBeUndefined();
      expect(getColumnToChange(mockCard as never, undefined as never)).toBeUndefined();
      expect(getColumnToChange(undefined as never, mockValues as never)).toBeUndefined();
    });
  });
});
