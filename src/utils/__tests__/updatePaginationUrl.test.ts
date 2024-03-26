import { updatePaginationUrl } from "../updatePaginationUrl";

describe("updatePaginationUrl", () => {
  test("should replace to the next page", () => {
    expect(updatePaginationUrl("https://api.net/projects.json"))
      .toBe("https://api.net/projects.json?page=2");

    expect(updatePaginationUrl("https://api.net/projects.json?page=1"))
      .toBe("https://api.net/projects.json?page=2");

    expect(updatePaginationUrl("https://api.net/projects.json?page=2&page=3"))
      .toBe("https://api.net/projects.json?page=4");

    expect(updatePaginationUrl("https://api.net/projects.json?page=2&page=3"))
      .toBe("https://api.net/projects.json?page=4");
  });
});
