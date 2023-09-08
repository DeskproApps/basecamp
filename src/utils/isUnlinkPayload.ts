import has from "lodash/has";
import type { EventPayload, UnlinkPayload } from "../types";

const isUnlinkPayload = (
  payload: EventPayload,
): payload is UnlinkPayload => {
  return has(payload, ["card"]) && has(payload, ["meta"]);
};

export { isUnlinkPayload };
