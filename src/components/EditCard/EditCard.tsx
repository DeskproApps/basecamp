import { Container } from "../common";
import { CardForm } from "../CardForm";
import type { FC } from "react";
import type { Props as FormProps } from "../CardForm";

type Props = Omit<FormProps, "card"|"cardMeta"> & {
  card: FormProps["card"],
  cardMeta: FormProps["cardMeta"],
};

const EditCard: FC<Props> = (props) => {
  return (
    <Container>
      <CardForm {...props} isEditMode />
    </Container>
  );
};

export { EditCard };
