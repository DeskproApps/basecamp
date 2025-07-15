import styled from "styled-components";
import { TSpan } from "@deskpro/deskpro-ui";
import type { TProps } from "@deskpro/deskpro-ui";
import type { FC, PropsWithChildren } from "react";
import type { DeskproAppTheme } from "@deskpro/app-sdk";

type Props = PropsWithChildren<Omit<TProps, "type">> & {
  type?: TProps["type"],
};

const InvalidStyled = styled(TSpan)<DeskproAppTheme>`
  color: ${({ theme }) => theme.colors.red100};
`;

const Invalid: FC<Props> = ({ type = "p1", ...props }) => {
  return (
    <InvalidStyled type={type} {...props} />
  );
};

export { Invalid };
