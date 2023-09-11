import type { DateTime, Maybe, DateOn } from "../../types";

export type Response<T> = Promise<T>;

export type BasecampAPIError = {
  status: number,
  error: string,
};

export type AccessToken = {
  expires_in: number,
  access_token: string,
  refresh_token: string,
};

export type Account = {
  id: number,
  name: string,
  product: string,
  href: string, // api href
  app_href: string, // web href
  hidden: false
};

export type AuthInfo = {
  expires_at: DateTime,
  identity: {
    id: number,
    email_address: string,
    first_name: string,
    last_name: string,
  },
  accounts: Account[],
};

export type DockType =
  | "message_board"
  | "todoset"
  | "vault"
  | "chat"
  | "schedule"
  | "questionnaire"
  | "inbox"
  | "kanban_board" // <== this is the one we need
;

export type Dock = {
  id: number
  title: string,
  name: DockType,
  enabled: boolean,
  position: number,
  url: string,
  app_url: string,
};

export type ProjectType = "active"|"archived"|"trashed"

export type Project = {
  id: number,
  status: ProjectType,
  created_at: DateTime,
  updated_at: DateTime,
  name: string,
  description: string,
  purpose: string, // "topic",
  clients_enabled: boolean,
  bookmark_url: string,
  url: string,
  app_url: string,
  dock: Dock[],
  bookmarked: boolean,
};

export type Person = {
  id: number,
  attachable_sgid: string,
  name: string,
  email_address: string,
  personable_type: "User",
  title: string, // "Frontend Developer",
  bio: string,
  location: string,
  created_at: DateTime,
  updated_at: DateTime,
  admin: boolean,
  owner: boolean,
  client: boolean,
  employee: boolean
  time_zone: string, // "Europe/Kiev",
  avatar_url: string,
  company: Pick<Account, "id"|"name">,
  can_ping: boolean,
  can_manage_projects: boolean,
  can_manage_people: boolean,
};

export type Column = {
  id: number,
  status: string // "active",
  visible_to_clients: boolean,
  created_at: DateTime,
  updated_at: DateTime,
  title: string,
  inherits_status: boolean,
  type: "Kanban::Triage",
  url: string,
  app_url: string,
  bookmark_url: string,
  subscription_url: string,
  parent: Pick<CardTable, "id"|"title"|"url"|"app_url"|"type">,
  bucket: Pick<Project, "id"|"name"> & {
    type: "Project"
  },
  creator: Person,
  description: Maybe<string>,
  subscribers: Person[],
  color: null,
  cards_count: number,
  comment_count: number,
  cards_url: string,
};

export type CardTable = {
  id: number,
  status: string, // "active",
  visible_to_clients: boolean,
  created_at: DateTime,
  updated_at: DateTime,
  title: string,
  inherits_status: boolean,
  type: "Kanban::Board",
  url: string,
  app_url: string,
  bookmark_url: string,
  subscription_url: string,
  position: number,
  bucket: Pick<Project, "id"|"name"> & {
    type: "Project",
  },
  creator: Person,
  subscribers: Person[],
  lists: Column[],
}

export type CardStep = {
  id: number,
  status: string, // "active",
  visible_to_clients: boolean,
  created_at: DateTime,
  updated_at: DateTime,
  title: string,
  inherits_status: boolean,
  type: "Kanban::Step",
  url: string,
  app_url: string,
  bookmark_url: string,
  position: number,
  parent: Pick<Card, "id"|"title"|"url"|"app_url"|"type">,
  bucket: Pick<Project, "id"|"name"> & {
    type: "Project"
  },
  creator: Person,
  completed: boolean,
  due_on: Maybe<DateOn>,
  assignees: Person[],
  completion_url: string,
};

export type Card = {
  id: number,
  status: string, // "active",
  visible_to_clients: boolean,
  created_at: DateTime,
  updated_at: DateTime,
  title: string,
  inherits_status: boolean,
  type: "Kanban::Card",
  url: string,
  app_url: string,
  bookmark_url: string,
  subscription_url: string,
  comments_count: number,
  comments_url: string,
  position: number,
  parent: Pick<Column, "id"|"title"|"url"|"app_url"> & {
    type: "Kanban::Column",
  },
  bucket: Pick<Project, "id"|"name"> & {
    type: "Project"
  },
  creator: Person,
  description: string,
  content: string,
  completed: boolean,
  due_on: Maybe<DateOn>,
  assignees: Person[],
  completion_subscribers: [],
  completion_url: string,
  comment_count: number,
  steps: CardStep[]
};

export type CardComment = {
  id: number,
  status: string, // "active",
  visible_to_clients: boolean,
  created_at: DateTime,
  updated_at: DateTime,
  title: string,
  inherits_status: boolean,
  type: "Comment",
  url: string,
  app_url: string,
  bookmark_url: string,
  parent: Pick<Card, "id"|"title"|"type"|"url"|"app_url">,
  bucket: Pick<Project, "id"|"name"> & {
    type: "Project"
  },
  creator: Person,
  content: string,
};
