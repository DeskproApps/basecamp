import { Fragment } from "react";
import size from "lodash/size";
import { Checkbox } from "@deskpro/deskpro-ui";
import { LoadingSpinner, HorizontalDivider } from "@deskpro/app-sdk";
import { CardItem } from "../../CardItem";
import { NoFound, Card } from "../../common";
import type { FC } from "react";
import type { Maybe } from "../../../types";
import type { Card as CardType, Account, Project } from "../../../services/basecamp/types";

type Props = {
  cards: CardType[],
  isLoading: boolean,
  projects: Project[],
  account: Maybe<Account>,
  selectedCards: CardType[],
  onChangeSelectedCard: (card: CardType) => void,
};

const Cards: FC<Props> = ({
  cards,
  account,
  projects,
  isLoading,
  selectedCards,
  onChangeSelectedCard,
}) => {
  if (isLoading) {
    return (
      <LoadingSpinner />
    );
  }

  return (
    <>
      {!Array.isArray(cards)
        ? <NoFound/>
        : !size(cards)
          ? <NoFound text="No Basecamp cards found"/>
          : cards.map((card) => (
            <Fragment key={card.id}>
              <Card>
                <Card.Media>
                  <Checkbox
                    size={12}
                    containerStyle={{ marginTop: 4 }}
                    onChange={() => onChangeSelectedCard(card)}
                    checked={selectedCards.some((selectedCard) => {
                      return card.id === selectedCard.id;
                    })}
                  />
                </Card.Media>
                <Card.Body>
                  <CardItem
                    card={card}
                    account={account}
                    projects={projects}
                    onClickTitle={() => onChangeSelectedCard(card)}
                  />
                </Card.Body>
              </Card>
              <HorizontalDivider style={{ marginBottom: 6 }} />
            </Fragment>
          ))
      }
    </>
  );
};

export { Cards };
