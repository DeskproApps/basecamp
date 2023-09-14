import styled from "styled-components";
import { TSpan } from "@deskpro/deskpro-ui";
import { toHTML } from "./utils";
import { dpNormalize } from "../../../styles";
import type { FC } from "react";

type Props = {
  text: string,
};

const MarkdownStyled = styled(TSpan)`
  width: 100%;
  ${dpNormalize}
`;

const Markdown: FC<Props> = ({ text }) => (
  <MarkdownStyled
    type="p5"
    dangerouslySetInnerHTML={{__html: toHTML(text)}}
  />
);

export { Markdown };
