import { useMemo } from "react";
import get from "lodash/get";
import flatten from "lodash/flatten";
import { getOption } from "../../../utils";
import { Label, Select } from "../../common";
import { nbsp } from "../../../constants";
import type { FC, Dispatch } from "react";
import type { Maybe, Option, CardTableTree } from "../../../types";
import type { Account, Dock } from "../../../services/basecamp/types";

export type Props = {
  accounts: Account[],
  cardTables: CardTableTree,
  selectedAccount: Maybe<Account["id"]>,
  onChangeAccount: Dispatch<Account["id"]>,
  selectedCardTable: Maybe<Dock["id"]>,
  onChangeCardTable: Dispatch<Dock["id"]>,
};

const Filters: FC<Props> = ({
  accounts,
  cardTables,
  selectedAccount,
  onChangeAccount,
  onChangeCardTable,
  selectedCardTable,
}) => {
  const accountOptions = useMemo(() => {
    return (!Array.isArray(accounts) ? [] : accounts)
      .map(({ id, name }) => getOption(id, name));
  }, [accounts]);

  const cardTableOptions = useMemo(() => {
    return flatten((!Array.isArray(cardTables) ? [] : cardTables)
      .map((project) => [
        { type: "header", label: project.name },
        ...(get(project, ["cardTables"], []) || []).map(({ id, name }) => {
          return getOption(id, `${nbsp}${nbsp}${nbsp}${name}`);
        }),
      ]));
  }, [cardTables]) as Array<Option<Dock["id"]>>;

  return (
    <>
      <Label label="Account" required>
        <Select<Account["id"]>
          id="account"
          value={selectedAccount}
          options={accountOptions}
          onChange={(o) => onChangeAccount(o.value)}
          noFoundText="No account(s) found"
        />
      </Label>

      <Label label="Card Table" required>
        <Select<Dock["id"]>
          id="cardTable"
          value={selectedCardTable}
          options={cardTableOptions}
          onChange={(o) => onChangeCardTable(o.value)}
          noFoundText="No card table(s) found"
        />
      </Label>
    </>
  );
};

export { Filters };
