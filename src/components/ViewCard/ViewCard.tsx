import { HorizontalDivider } from "@deskpro/app-sdk";
import { Container } from "../common";
import { Details, Steps, Comments } from "./blocks";
import type { FC } from "react";
import type { Card, Project, Account, CardComment, CardStep } from "../../services/basecamp/types";

type Props = {
  card: Card,
  account: Account,
  project: Project,
  comments: CardComment[],
  onNavigateToAddComment: () => void,
  onChangeStepComplete: (
    stepId: CardStep["id"],
    complete: boolean,
  ) => Promise<CardStep|void>,
};

const ViewCard: FC<Props> = ({
  card,
  account,
  project,
  comments,
  onChangeStepComplete,
  onNavigateToAddComment,
}) => {
  return (
    <>
      <Container>
        <Details card={card} account={account} project={project} />
      </Container>

      <HorizontalDivider />

      <Container>
        <Steps card={card} onChangeStepComplete={onChangeStepComplete}/>
      </Container>

      <HorizontalDivider />

      <Container>
        <Comments comments={comments} onNavigateToAddComment={onNavigateToAddComment} />
      </Container>
    </>
  );
};

export { ViewCard };
