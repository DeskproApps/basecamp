import { z } from "zod";
import { validationSchema } from "./utils";
import type { Maybe, DateOn } from "../../types";
import type { Person, Card } from "../../services/basecamp/types";


export type FormValidationSchema = z.infer<typeof validationSchema>;

export type CardValues = {
  title: Card["title"]
  content?: Card["content"],
  due_on?: DateOn,
  assignee_ids?: Array<Person["id"]>,
};

export type Props = {
  onSubmit: (values: FormValidationSchema) => Promise<void|Card>,
  onCancel?: () => void,
  isEditMode?: boolean,
  error?: Maybe<string|string[]>,
};
