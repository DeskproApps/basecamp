import has from "lodash/has";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input, Stack } from "@deskpro/deskpro-ui";
import { LoadingSpinner } from "@deskpro/app-sdk";
import { useFormDeps } from "./hooks";
import { Label, Button, Select, TextArea, ErrorBlock, DateInput } from "../common";
import { getInitValues, validationSchema } from "./utils";
import type { FC } from "react";
import type { FormValidationSchema, Props } from "./types";
import type { Account, Project, CardTable, Column, Person } from "../../services/basecamp/types";

const CardForm: FC<Props> = ({
  error,
  onSubmit,
  onCancel,
  isEditMode,
}) => {
  const {
    watch,
    register,
    setValue,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValidationSchema>({
    defaultValues: getInitValues(),
    resolver: zodResolver(validationSchema),
  });
  const {
    isLoading,
    columnOptions,
    peopleOptions,
    accountOptions,
    projectOptions,
    cardTableOptions,
  } = useFormDeps({
    accountId: watch("account"),
    projectId: watch("project"),
    cardTableId: watch("cardTable"),
  });

  if (isLoading) {
    return (
      <LoadingSpinner/>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {error && <ErrorBlock text={error}/>}

      <Label htmlFor="account" label="Account" required>
        <Select<Account["id"]>
          id="account"
          disabled={isEditMode}
          value={watch("account")}
          options={accountOptions}
          noFoundText="No account(s) found"
          onChange={({ value }) => {
            setValue("account", value);
            setValue("project", 0);
            setValue("cardTable", 0);
            setValue("column", 0);
            setValue("assignees", []);
          }}
          error={has(errors, ["account", "message"])}
        />
      </Label>

      <Label htmlFor="project" label="Project" required>
        <Select<Project["id"]>
          id="project"
          disabled={isEditMode}
          value={watch("project")}
          options={projectOptions}
          noFoundText="No project(s) found"
          onChange={({ value }) => {
            setValue("project", value);
            setValue("cardTable", 0);
            setValue("column", 0);
            setValue("assignees", []);
          }}
          error={has(errors, ["project", "message"])}
        />
      </Label>

      <Label htmlFor="cardTable" label="Card Table" required>
        <Select<CardTable["id"]>
          id="cardTable"
          value={watch("cardTable")}
          options={cardTableOptions}
          noFoundText="No card table(s) found"
          onChange={({ value }) => {
            setValue("cardTable", value);
            setValue("column", 0);
            setValue("assignees", []);
          }}
          error={has(errors, ["project", "message"])}
        />
      </Label>

      <Label htmlFor="column" label="Column" required>
        <Select<Column["id"]>
          id="column"
          value={watch("column")}
          options={columnOptions}
          noFoundText="No column(s) found"
          onChange={({ value }) => {
            setValue("column", value);
            setValue("assignees", []);
          }}
          error={has(errors, ["column", "message"])}
        />
      </Label>

      <Label htmlFor="title" label="Title" required>
        <Input
          id="title"
          type="text"
          variant="inline"
          inputsize="small"
          placeholder="Add value"
          error={has(errors, ["title", "message"])}
          value={watch("title")}
          {...register("title")}
        />
      </Label>

      <Label htmlFor="assignees" label="Assign card">
        <Select<Person["id"]>
          id="assignees"
          value={watch("assignees")}
          options={peopleOptions}
          closeOnSelect={false}
          noFoundText="No assignee(s) found"
          onChange={(o) => {
            const assignees = watch("assignees");

            if (o.value) {
              const selectedAssignees = Array.isArray(assignees) ? assignees : [];
              const newValue = selectedAssignees.includes(o.value)
                ? selectedAssignees.filter((assignee) => assignee !== o.value)
                : [...selectedAssignees, o.value];

              setValue("assignees", newValue);
            }
          }}
          error={has(errors, ["assignees", "message"])}
        />
      </Label>

      <Label htmlFor="dueDate" label="Due on">
        <DateInput
          id="dueDate"
          placeholder="DD/MM/YYYY"
          value={watch("dueDate") as Date}
          error={has(errors, ["dueDate", "message"])}
          onChange={(date) => setValue("dueDate", date[0])}
        />
      </Label>

      <Label htmlFor="content" label="Description">
        <TextArea
          variant="inline"
          id="content"
          minHeight="auto"
          placeholder="Enter value"
          value={watch("content")}
          error={has(errors, ["content", "message"])}
          {...register("content")}
        />
      </Label>

      <Stack justify="space-between">
        <Button
          type="submit"
          text={isEditMode ? "Save" : "Create"}
          disabled={isSubmitting}
          loading={isSubmitting}
        />
        {onCancel && (
          <Button type="button" text="Cancel" intent="tertiary" onClick={onCancel}/>
        )}
      </Stack>
    </form>
  );
};

export { CardForm };
