import { useCallback } from "react";
import get from "lodash/get";
import {
  Title,
  Property,
  TwoProperties,
} from "@deskpro/app-sdk";
import { format } from "../../utils/date";
import { entity } from "../../utils";
import {
  Link,
  BasecampLogo,
  TextWithLink,
  DeskproTickets,
} from "../common";
import type { FC, MouseEventHandler } from "react";
import type { Maybe } from "../../types";
import type { Card, Account, Project } from "../../services/basecamp/types";

type Props = {
  card: Card,
  project: Maybe<Project>,
  account: Maybe<Account>,
  onClickTitle?: (accountId: Account["id"], projectId: Project["id"], cardId: Card["id"]) => void,
};

const CardItem: FC<Props> = ({ card, account, project, onClickTitle }) => {
  const onClick: MouseEventHandler<HTMLAnchorElement> = useCallback((e) => {
    e.preventDefault();

    const cardId = get(card, ["id"]);
    const accountId = get(account, ["id"]);
    const projectId = get(project, ["id"]);

    if (onClickTitle && accountId && projectId && cardId) {
      onClickTitle(accountId, projectId, cardId);
    }
  }, [onClickTitle, account, project, card]);

  return (
    <>
      <Title
        title={!onClickTitle
          ? get(card, ["title"])
          : (<Link href="#" onClick={onClick}>{get(card, ["title"])}</Link>)
        }
        marginBottom={10}
        icon={<BasecampLogo/>}
        link={get(card, ["app_url"])}
      />
      <TwoProperties
        leftLabel="Account"
        leftText={(
          <TextWithLink text={get(account, ["name"])} link={get(account, ["app_href"])} />
        )}
        rightLabel="Project"
        rightText={(
          <TextWithLink text={get(project, ["name"])} link={get(project, ["app_url"])} />
        )}
      />
      <TwoProperties
        leftLabel="Column"
        leftText={(
          <TextWithLink
            text={get(card, ["parent", "title"])}
            link={get(card, ["parent", "app_url"])}
          />
        )}
        rightLabel="Date Created"
        rightText={format(get(card, ["created_at"]))}
      />
      <Property
        label="Deskpro Tickets"
        text={<DeskproTickets entityId={entity.generateId(account, card)} />}
      />
    </>
  );
};

export { CardItem };
