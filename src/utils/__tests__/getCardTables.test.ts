import cloneDeep from "lodash/cloneDeep";
import { getCardTables } from "../getCardTables";
import { mockProjects } from "../../../testing";

describe("getCardTables", () => {
  test("should return card tables", () => {
    expect(getCardTables(mockProjects as never)).toStrictEqual([
      {
        id: 201,
        name: "Deskpro Apps Lab",
        cardTables: [
          { id: 6507629791, name: "Card Table", },
          { id: 6508451645, name: "Test Card Table", },
        ],
      },
      {
        id: 202,
        name: "Getting Started",
        cardTables: [{ id: 6507614027, name: "Starting Card Table" }],
      },
    ]);
  });

  test("should return card tables exclude disabled projects", () => {
    const projects = cloneDeep(mockProjects);
    projects[0].status = "archived";

    expect(getCardTables(projects as never)).toStrictEqual([
      {
        id: 202,
        name: "Getting Started",
        cardTables: [{ id: 6507614027, name: "Starting Card Table" }],
      },
    ]);
  });

  test("should return card tables exclude disabled docks", () => {
    const projects = cloneDeep(mockProjects);
    projects[0].dock[7].enabled = false;
    projects[0].dock[8].enabled = false;
    projects[1].dock[7].enabled = false;

    expect(getCardTables(projects as never)).toStrictEqual([]);
  });

  test.each(
    [undefined, null, "", 0, true, false, {}, []]
  )("wrong value %p", (value) => {
    expect(getCardTables(value as never)).toStrictEqual([]);
  });
});
