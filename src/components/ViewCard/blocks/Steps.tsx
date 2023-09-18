import get from "lodash/get";
import size from "lodash/size";
import { Title } from "@deskpro/app-sdk";
import { ChecklistItem, NoFound } from "../../common";
import type { FC } from "react";
import type { Card, CardStep } from "../../../services/basecamp/types";

type Props = {
  card: Card,
  onChangeStepComplete: (
    stepId: CardStep["id"],
    complete: boolean,
  ) => Promise<CardStep|void>,
};

const Steps: FC<Props> = ({ card, onChangeStepComplete }) => {
  const steps = get(card, ["steps"], []) || [];

  return (
    <>
      <Title title="Steps" />

      {!Array.isArray(steps) || !size(steps)
        ? <NoFound text="No steps found"/>
        : steps.map((step) => (
          <ChecklistItem
            key={step.id}
            name={step.title}
            checked={step.completed}
            onComplete={() => onChangeStepComplete(step.id, !step.completed)}
          />
        ))
      }
    </>
  );
};

export { Steps };
