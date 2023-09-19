import { useState } from "react";
import noop from "lodash/noop";
import { P5 } from "@deskpro/deskpro-ui";
import { useInitialisedDeskproAppClient } from "@deskpro/app-sdk";
import { getEntityAssociationCountService } from "../../../services/deskpro";
import type { FC } from "react";
import type { Maybe } from "../../../types";

type Props = { entityId?: Maybe<string> };

const DeskproTickets: FC<Props> = ({ entityId }) => {
  const [ticketCount, setTicketCount] = useState<number>(0);

  useInitialisedDeskproAppClient((client) => {
    if (entityId) {
      getEntityAssociationCountService(client, `${entityId}`)
        .then(setTicketCount)
        .catch(noop);
    }
  }, [entityId]);

  return <P5>{ticketCount}</P5>;
};

export { DeskproTickets };
