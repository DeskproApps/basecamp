import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import { Title } from "@deskpro/app-sdk";
import { ChecklistItem } from "../../common";
import type { FC } from "react";
import type { Card } from "../../../services/basecamp/types";

type Props = {
  card: Card,
};

const Steps: FC<Props> = ({ card }) => {
  const steps = get(card, ["steps"], []) || [];

  return (
    <>
      <Title title="Steps" />

      {!isEmpty(steps) && steps.map((step) => (
        <ChecklistItem
          key={step.id}
          name={step.title}
          disabled={true}
          checked={step.completed}
        />
      ))}
    </>
  );
};

export { Steps };
