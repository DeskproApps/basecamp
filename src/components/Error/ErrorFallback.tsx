import { BasecampError } from "../../services/basecamp";
import { Container, ErrorBlock } from "../common";
import { DEFAULT_ERROR } from "../../constants";
import { Stack } from "@deskpro/deskpro-ui";
import { FallbackRender } from "@sentry/react";

const ErrorFallback: FallbackRender = ({ error }) => {
  let message = DEFAULT_ERROR;
  const button = null;

  // eslint-disable-next-line no-console
  console.error(error);

  if (error instanceof BasecampError) {
    message = error.data?.error ?? DEFAULT_ERROR
  } else if (error instanceof Error) {
    message = error.message.trim() !== "" ? error.message : DEFAULT_ERROR
  } else {
    message = DEFAULT_ERROR
  }

  return (
    <Container>
      <ErrorBlock
        text={(
          <Stack gap={6} vertical style={{ padding: "8px" }}>
            {message}
            {button}
          </Stack>
        )}
      />
    </Container>
  );
};

export { ErrorFallback };
