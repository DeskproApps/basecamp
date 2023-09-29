import { getCardsMap } from "../../useReplyBox";
import { mockCards } from "../../../../testing";

const mockCardsMeta = ["101/201/6507640630", "101/201/6528741930"];

describe("useReplyBox", () => {
  describe("getCardsMap", () => {
    test("should return cards map", () => {
      expect(getCardsMap(mockCards as never[], mockCardsMeta)).toMatchObject({
        "101/201/6507640630": { id: 6507640630 },
        "101/201/6528741930": { id: 6528741930 },
      });
    });

    test("should return cards map even if not all data has been matched", () => {
        expect(getCardsMap([mockCards[1]] as never[], mockCardsMeta)).toMatchObject({
          "101/201/6528741930": { id: 6528741930 },
        });
        expect(getCardsMap(mockCards as never[], [mockCardsMeta[0]])).toMatchObject({
          "101/201/6507640630": { id: 6507640630 },
        });
    });

    test("shouldn't return cards map if no pass some of data", () => {
      expect(getCardsMap(mockCards as never[])).toEqual({});
      expect(getCardsMap(undefined, mockCardsMeta)).toEqual({});
    });
  });
});
