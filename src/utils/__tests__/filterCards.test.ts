import { filterCards } from "../filterCards";

const mockCards = [
  { id: 101, title: "Link Cards page" },
  { id: 102, title: "Home page" },
  { id: 1013, title: "Details card page" },
];

describe("filterCards", () => {
  test("shouldn't return cards if empty cards", () => {
    expect(filterCards([])).toStrictEqual([]);
  });

  test("should return filtered cards by title", () => {
    expect(filterCards(mockCards as never, { query: "link" }))
      .toEqual([{ id: 101, title: "Link Cards page" }]);
  });

  test("should return filtered cards by cardId", () => {
    expect(filterCards(mockCards as never, { query: 102 }))
      .toEqual([{ id: 102, title: "Home page" }]);
    expect(filterCards(mockCards as never, { query: 101 }))
      .toEqual([
        { id: 101, title: "Link Cards page" },
        { id: 1013, title: "Details card page" },
      ]);
  });
});
