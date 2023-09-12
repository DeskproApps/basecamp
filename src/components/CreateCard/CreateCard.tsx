import { Container, Navigation } from "../common";
import { CardForm } from "../CardForm";
import type { FC } from "react";
import type { Props as FormProps } from "../CardForm";

type Props = FormProps & {
  onNavigateToLink: () => void,
};

const CreateCard: FC<Props> = ({ onNavigateToLink, ...props }) => {
    return (
      <Container>
        <Navigation selected="create" onNavigateToLink={onNavigateToLink}/>
        <CardForm {...props} />
      </Container>
    );
};

export { CreateCard };
