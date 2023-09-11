import { useMemo } from "react";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import { Stack } from "@deskpro/deskpro-ui";
import { Title, Property } from "@deskpro/app-sdk";
import { format } from "../../../utils/date";
import { entity } from "../../../utils";
import {
  Member,
  DPNormalize,
  BasecampLogo,
  TextWithLink,
  DeskproTickets,
} from "../../common";
import type { FC } from "react";
import type { Card, Account, Project } from "../../../services/basecamp/types";

type Props = {
  card: Card,
  account: Account,
  project: Project,
};

const Details: FC<Props> = ({ card, account, project }) => {
  const assignees = useMemo(() => {
    return get(card, ["assignees"], []) || [];
  }, [card]);

  return (
    <>
      <Title
        title={get(card, ["title"], "-")}
        icon={<BasecampLogo/>}
        link={get(card, ["app_url"])}
      />
      <Property
        label="Account"
        text={(
          <TextWithLink text={get(account, ["name"])} link={get(account, ["app_href"])} />
        )}
      />
      <Property
        label="Project"
        text={(
          <TextWithLink text={get(project, ["name"])} link={get(project, ["app_url"])} />
        )}
      />
      <Property
        label="Column"
        text={(
          <TextWithLink text={get(card, ["parent", "title"])} link={get(card, ["parent", "app_url"])} />
        )}
      />
      <Property
        label="Assigned to"
        text={isEmpty(assignees) ? "-" : (
          <Stack gap={6} wrap="wrap">
            {assignees.map((assignee) => (
              <Member
                key={get(assignee, ["id"])}
                name={get(assignee, ["name"]) || get(assignee, ["email_address"]) || "-"}
                avatarUrl={get(assignee, ["avatar_url"])}
              />
            ))}
          </Stack>
        )}
      />
      <Property
        label="Date Created"
        text={format(get(card, ["created_at"]))}
      />
      <Property
        label="Due on"
        text={format(get(card, ["due_on"]))}
      />
      <Property
        label="Deskpro Tickets"
        text={<DeskproTickets entityId={entity.generateId(account, card)} />}
      />
      <Property
        label="Notes"
        text={(
          <DPNormalize text={get(card, ["content"])} />
        )}
      />
    </>
  );
};

export { Details };
