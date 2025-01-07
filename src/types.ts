import type { To, ParamKeyValuePair } from "react-router-dom";
import type { DropdownValueType } from "@deskpro/deskpro-ui";
import type { Context, IDeskproClient } from "@deskpro/app-sdk";
import type {
  Dock,
  Card,
  Person,
  Column,
  Account,
  Project,
  Response,
} from "./services/basecamp/types";

/** Common types */
export type Maybe<T> = T | undefined | null;

export type Dict<T> = Record<string, T>;

export type Option<Value = unknown> = Omit<DropdownValueType<Value>, "subItems">;

/** An ISO-8601 encoded UTC date time string. Example value: `""2019-09-07T15:50:00Z"` */
export type DateTime = string;

export type DateOn = string; // "2023-09-09"

/** Request types */
export type ApiRequestMethod = "GET" | "POST" | "PUT" | "DELETE";

export type RequestParams = {
  url?: string,
  rawUrl?: string,
  method?: ApiRequestMethod,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: Dict<any>|RequestInit["body"],
  headers?: Dict<string>,
  queryParams?: string|Dict<string>|ParamKeyValuePair[],
  pagination?: boolean;
};

export type Request = <T>(
  client: IDeskproClient,
  params: RequestParams,
) => Response<T>;

/** Deskpro types */
export type Settings = {
  client_id?: string,
  client_secret?: string,
  add_comment_when_linking?: boolean,
};

export type TicketData = {
  ticket: {
    id: string,
    subject: string,
    permalinkUrl: string,
  },
};

export type TicketContext = Context<TicketData, Maybe<Settings>>;

export type NavigateToChangePage = { type: "changePage", path: To };

export type LogoutPayload = { type: "logout" };

export type UnlinkPayload = { type: "unlink", card: Card, meta: CardMeta };

export type EventPayload =
  | NavigateToChangePage
  | LogoutPayload
  | UnlinkPayload
;

/** Entities */
export type CardMetaAsString = string;

export type CardMeta = {
  accountId: Account["id"],
  projectId: Project["id"],
  cardId: Card["id"],
};

export type CardTable = {
  id: Dock["id"],
  name: Dock["title"],
};

export type ProjectTree = {
  id: Project["id"],
  name: Project["name"],
  cardTables: CardTable[],
};

export type CardTableTree = ProjectTree[];

export type EntityMetadata = {
  id: Card["id"],
  title: Card["title"],
  account?: { id: Account["id"], title: Account["name"] },
  project: { id: Project["id"], title: Project["name"] },
  column: Column["title"],
  assignees?: Array<{ id: Person["id"], fullName: Person["name"]|Person["email_address"] }>,
  dueDate?: DateOn,
};
