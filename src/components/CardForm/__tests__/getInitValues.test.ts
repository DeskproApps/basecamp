import { getInitValues } from "../utils";

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

    test.todo("should return init values for edit card");
  });
});
