import { z } from "zod";
import { validationSchema } from "./utils";
import type { SubmitHandler } from "react-hook-form";
import type { Maybe } from "../../types";
import type { CardComment } from "../../services/basecamp/types";

export type FormValidationSchema = z.infer<typeof validationSchema>;

export type CommentValues = {
  content: CardComment["content"],
};

export type Props = {
  onSubmit: SubmitHandler<FormValidationSchema>,
  onCancel?: () => void,
  error?: Maybe<string|string[]>,
};
