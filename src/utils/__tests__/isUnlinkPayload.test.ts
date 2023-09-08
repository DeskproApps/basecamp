import omit from "lodash/omit";
import { isUnlinkPayload } from "../isUnlinkPayload";
import { mockCard } from "../../../testing";

const payload = {
  type: "unlink",
  card: mockCard,
  meta: { accountId: 101, projectId: 201, cardId: mockCard.id },
};

describe("isUnlinkPayload", () => {
  test.each([undefined, null, "", 0, true, false, {}])("wrong value: %p", (payload) => {
    expect(isUnlinkPayload(payload as never)).toBeFalsy();
  });

  test("shouldn't be unlink payload", () => {
    expect(isUnlinkPayload(omit(payload, ["card"]) as never)).toBeFalsy();
    expect(isUnlinkPayload(omit(payload, ["meta"]) as never)).toBeFalsy();
  });

  test("should unlink payload", () => {
    expect(isUnlinkPayload(payload as never)).toBeTruthy();
  });
});
