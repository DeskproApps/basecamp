import cloneDeep from "lodash/cloneDeep";
import { getInitValues } from "../utils";
import { mockCard } from "../../../../testing";

describe("CardForm", () => {
  describe("getInitValues", () => {
    test("should return init values for new card", () => {
      expect(getInitValues()).toEqual({
        account: 0,
        project: 0,
        cardTable: 0,
        column: 0,
        title: "",
        assignees: [],
        dueDate: undefined,
        content: "",
      });
    });

    test("should return init values for edit card", () => {
      const card = cloneDeep(mockCard);
      card.content = "<h1>Description/Note</h1>";
      const cardMeta = {
        accountId: 101,
        projectId: 201,
        cardId: 6507640630,
        cardTableId: 6507629791,
      };
      expect(getInitValues(card as never, cardMeta)).toEqual({
        account: 101,
        project: 201,
        cardTable: 6507629791,
        column: 6507629798,
        title: "Research",
        assignees: [44506648, 44506585],
        dueDate: new Date("2023-10-09T00:00:00.000Z"),
        content: "Description/Note\n================",
      });
    });
  });
});
