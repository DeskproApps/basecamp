import { useState, useCallback } from "react";
import { faSearch, faTimes, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Input, IconButton } from "@deskpro/deskpro-ui";
import { Label } from "../Label";
import type { FC, ChangeEvent } from "react";
import type { AnyIcon } from "@deskpro/deskpro-ui";

export type Props = {
  label?: string,
  onChange?: (search: string) => void,
  disabled?: boolean,
  required?: boolean,
  isFetching?: boolean,
};

const Search: FC<Props> = ({
  label,
  onChange,
  disabled = false,
  required = false,
  isFetching = false,
}) => {
  const [search, setSearch] = useState<string>("");

  const onChangeSearch = useCallback(({ target: { value: q }}: ChangeEvent<HTMLInputElement>) => {
    setSearch(q);
    onChange && onChange(q);
  }, [onChange]);

  const onClearSearch = useCallback(() => {
    setSearch("");
    onChange && onChange("");
  }, [onChange]);

  return (
    <Label
      required={required}
      label={label}
      htmlFor="search"
    >
      <Input
        id="search"
        name="search"
        value={search}
        disabled={disabled}
        onChange={onChangeSearch}
        placeholder="Search"
        leftIcon={isFetching
          ? <FontAwesomeIcon icon={faSpinner as never} spin/>
          : faSearch as AnyIcon
        }
        rightIcon={(
          <IconButton
            minimal
            data-testid="search-reset"
            icon={faTimes as never}
            onClick={onClearSearch}
          />
        )}
      />
    </Label>
  );
}

export { Search };
