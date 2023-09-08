import cloneDeep from "lodash/cloneDeep";
import { entity } from "../entity";
import { mockCard, mockAuthInfo } from "../../../testing";

describe("entity", () => {
  describe("generateId", () => {
    test("should return card data as a string", () => {
      expect(entity.generateId(mockAuthInfo.accounts[0] as never, mockCard as never))
        .toEqual("101/201/6507640630");
    });

    test("shouldn't return if no data", () => {
      expect(entity.generateId()).toBeUndefined();
    });

    test("shouldn't return if no card", () => {
      expect(entity.generateId(mockAuthInfo.accounts[0] as never)).toBeUndefined();
    });

    test("shouldn't return if no account", () => {
      expect(entity.generateId(undefined, mockCard as never)).toBeUndefined();
    });

    test("shouldn't return if there is incomplete data", () => {
      const card = cloneDeep(mockCard);
      card.bucket = null as never;
      expect(entity.generateId(mockAuthInfo.accounts[0] as never, card as never)).toBeUndefined();
    });

    test.each([undefined, null, "", 0, true, false, {}])("wrong value: %p", (payload) => {
      expect(entity.generateId(payload as never)).toBeUndefined();
    });
  });
});
