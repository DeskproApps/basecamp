import get from "lodash/get";
import cloneDeep from "lodash/cloneDeep";
import toLower from "lodash/toLower";
import type { Maybe } from "../types";
import type { Card } from "../services/basecamp/types";

type Options = {
  query?: string|number,
};

const filterCards = (cards: Card[], options: Maybe<Options> = {}): Card[] => {
  const query = `${get(options, ["query"])}`;
  let filteredCards: Card[] = cloneDeep(cards);

  if (!query) {
    return filteredCards;
  }

  if (query) {
    filteredCards = cards.filter(({ id, title }) => {
      const cardTitle = toLower(title);
      const search = toLower(query);

      return cardTitle.includes(search) || `${id}`.includes(search);
    })
  }

  return filteredCards;
};

export { filterCards };
