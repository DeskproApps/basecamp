import type { BasecampAPIError } from "./types";

export type InitData = {
  status: number,
  data: BasecampAPIError,
};

class BasecampError extends Error {
  status: number;
  data: BasecampAPIError;

  constructor({ status, data }: InitData) {
    const message = "Basecamp Api Error";
    super(message);

    this.data = data;
    this.status = status;
  }
}

export { BasecampError };
