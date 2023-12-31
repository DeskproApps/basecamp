import { Fragment } from "react";
import get from "lodash/get";
import size from "lodash/size";
import find from "lodash/find";
import { HorizontalDivider } from "@deskpro/app-sdk";
import { Container, NoFound } from "../common";
import { CardItem } from "../CardItem";
import type { FC } from "react";
import type { Maybe, CardMeta } from "../../types";
import type { Card, Account, Project } from "../../services/basecamp/types";

export type Props = {
  cards: Card[],
  cardsMeta?: Maybe<CardMeta[]>,
  accounts?: Maybe<Account[]>,
  projects?: Maybe<Project[]>,
  onNavigateToCard: (
    accountId: Account["id"],
    projectId: Project["id"],
    cardId: Card["id"],
  ) => void,
};

const Home: FC<Props> = ({ cards, accounts, projects, cardsMeta, onNavigateToCard }) => {
  return (
    <Container>
      {!Array.isArray(cards)
        ? <NoFound/>
        : !size(cards)
          ? <NoFound text="No Basecamp cards found"/>
          : cards.map((card) => (
            <Fragment key={card.id}>
              <CardItem
                card={card}
                onClickTitle={onNavigateToCard}
                account={find(accounts, { id: get(find(cardsMeta, { cardId: card.id }), "accountId") })}
                project={find(projects, { id: get(card, ["bucket", "id"]) })}
              />
              <HorizontalDivider style={{ margin: "10px 0" }}/>
            </Fragment>
          ))
      }
    </Container>
  );
};

export { Home };
