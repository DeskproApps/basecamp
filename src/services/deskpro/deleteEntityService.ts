import { IDeskproClient } from "@deskpro/app-sdk";
import { ENTITY } from "../../constants";
import type { CardMetaAsString } from "../../types";

const deleteEntityService = (
  client: IDeskproClient,
  ticketId: string,
  entityId: CardMetaAsString,
) => {
  return client
    .getEntityAssociation(ENTITY, ticketId)
    .delete(entityId);
};

export { deleteEntityService };
