import { entity } from "../entity";

describe("entity", () => {
  describe("parseId", () => {
    test("should return card data", () => {
      expect(entity.parseId("101/201/6507640630"))
        .toStrictEqual({
          accountId: 101,
          projectId: 201,
          cardId: 6507640630,
        });
    });

    test.each([undefined, null, "", 0, true, false, {}])("wrong value: %p", (payload) => {
      expect(entity.parseId(payload as never)).toBeUndefined()
    });
  });
});
