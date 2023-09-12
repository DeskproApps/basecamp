import { getCardMeta } from "../utils";
import mockValues from "./mockValues.json";

describe("CardForm", () => {
  describe("getCardMeta", () => {
    test("should return card metadata for create/edit card", () => {
      expect(getCardMeta(mockValues as never)).toEqual({
        accountId: 101,
        projectId: 201,
        columnId: 6507629798,
      });
    });
  });
});
