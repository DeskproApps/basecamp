import size from "lodash/size";
import { Stack } from "@deskpro/deskpro-ui";
import { Button } from "../../common";
import type { FC } from "react";
import type { Card } from "../../../services/basecamp/types";

type Props = {
  selectedCards: Card[],
  isSubmitting: boolean,
  onLinkCards: () => void,
  onCancel: () => void,
};

const Buttons: FC<Props> = ({ isSubmitting, selectedCards, onLinkCards, onCancel }) => (
  <Stack justify="space-between">
    <Button
      type="button"
      text="Link Cards"
      disabled={!size(selectedCards) || isSubmitting}
      loading={isSubmitting}
      onClick={onLinkCards}
    />
    <Button
      type="button"
      text="Cancel"
      intent="secondary"
      onClick={onCancel}
    />
  </Stack>
);

export { Buttons };
