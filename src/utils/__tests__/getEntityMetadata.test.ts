import omit from "lodash/omit";
import { getEntityMetadata } from "../getEntityMetadata";
import { mockCard, mockAuthInfo } from "../../../testing";

describe("getEntityMetadata", () => {
  test("should return metadata", () => {
    expect(getEntityMetadata(mockCard as never, mockAuthInfo.accounts[0] as never))
      .toStrictEqual({
        id: 6507640630,
        title: "Research",
        account: { id: 101, title: "Deskpro" },
        project: { id: 201, title: "Deskpro Apps Lab" },
        column: "In progress",
        assignees: [
          { id: 44506648, fullName: "David A." },
          { id: 44506585, fullName: "Taras Shevchenko" },
        ],
        dueDate: "2023-10-09",
      });
  });

  test("shouldn't return account", () => {
    expect(getEntityMetadata(mockCard as never)).toStrictEqual({
      id: 6507640630,
      title: "Research",
      project: { id: 201, title: "Deskpro Apps Lab" },
      column: "In progress",
      assignees: [
        { id: 44506648, fullName: "David A." },
        { id: 44506585, fullName: "Taras Shevchenko" },
      ],
      dueDate: "2023-10-09",
    });
  });

  test("shouldn't return assignees", () => {
    const card = omit(mockCard, ["assignees"]);
    expect(getEntityMetadata(card as never, mockAuthInfo.accounts[0] as never))
      .toStrictEqual({
        id: 6507640630,
        title: "Research",
        account: { id: 101, title: "Deskpro" },
        project: { id: 201, title: "Deskpro Apps Lab" },
        column: "In progress",
        dueDate: "2023-10-09",
      });
  });

  test("shouldn't return dueDate", () => {
    const card = omit(mockCard, ["due_on"]);
    expect(getEntityMetadata(card as never, mockAuthInfo.accounts[0] as never))
      .toStrictEqual({
        id: 6507640630,
        title: "Research",
        account: { id: 101, title: "Deskpro" },
        project: { id: 201, title: "Deskpro Apps Lab" },
        column: "In progress",
        assignees: [
          { id: 44506648, fullName: "David A." },
          { id: 44506585, fullName: "Taras Shevchenko" },
        ],
      });
  });

  test("shouldn't return metadata", () => {
    expect(getEntityMetadata()).toBeUndefined();
  });
});
