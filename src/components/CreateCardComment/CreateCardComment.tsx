import { Container } from "../common";
import { CardCommentForm } from "../CardCommentForm";
import type { FC } from "react";
import type { Props as CommentFormProps } from "../CardCommentForm";

type Props = CommentFormProps;

const CreateCardComment: FC<Props> = (props) => {
  return (
    <Container>
      <CardCommentForm {...props}/>
    </Container>
  );
};

export { CreateCardComment };
