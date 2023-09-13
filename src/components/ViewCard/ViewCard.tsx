import { HorizontalDivider } from "@deskpro/app-sdk";
import { Container } from "../common";
import { Details, Steps, Comments } from "./blocks";
import type { FC } from "react";
import type { Card, Project, Account, CardComment } from "../../services/basecamp/types";

type Props = {
  card: Card,
  account: Account,
  project: Project,
  comments: CardComment[],
  onNavigateToAddComment: () => void,
};

const ViewCard: FC<Props> = ({ card, account, project, comments, onNavigateToAddComment }) => {
  return (
    <>
      <Container>
        <Details card={card} account={account} project={project} />
      </Container>

      <HorizontalDivider />

      <Container>
        <Steps card={card}/>
      </Container>

      <HorizontalDivider />

      <Container>
        <Comments comments={comments} onNavigateToAddComment={onNavigateToAddComment} />
      </Container>
    </>
  );
};

export { ViewCard };
