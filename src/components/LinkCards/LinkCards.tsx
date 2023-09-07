import { HorizontalDivider } from "@deskpro/app-sdk";
import { Search, Container } from "../common";
import { Filters, Buttons, Cards } from "./blocks";
import type { FC, Dispatch } from "react";
import type { Maybe, CardTableTree } from "../../types";
import type { Account, Dock, Card, Project } from "../../services/basecamp/types";

type Props = {
  onChangeSearch?: (search: string) => void,
  selectedAccount: Maybe<Account["id"]>,
  accounts: Account[],
  onChangeAccount: Dispatch<Account["id"]>,
  isLoading: boolean,
  isSubmitting: boolean,
  cardTables: CardTableTree,
  selectedCardTable: Maybe<Dock["id"]>,
  onChangeCardTable: Dispatch<Dock["id"]>,
  selectedCards: Card[],
  onLinkCards: () => void,
  onCancel: () => void,
  cards: Card[],
  onChangeSelectedCard: (card: Card) => void,
  account: Maybe<Account>,
  projects: Project[],
};

const LinkCards: FC<Props> = ({
  cards,
  account,
  accounts,
  onCancel,
  projects,
  isLoading,
  cardTables,
  onLinkCards,
  isSubmitting,
  selectedCards,
  onChangeSearch,
  selectedAccount,
  onChangeAccount,
  selectedCardTable,
  onChangeCardTable,
  onChangeSelectedCard,
}) => {
  return (
    <>
      <Container>
        <Search onChange={onChangeSearch}/>
        <Filters
          accounts={accounts}
          cardTables={cardTables}
          selectedAccount={selectedAccount}
          onChangeAccount={onChangeAccount}
          selectedCardTable={selectedCardTable}
          onChangeCardTable={onChangeCardTable}
        />
        <Buttons
          onCancel={onCancel}
          onLinkCards={onLinkCards}
          isSubmitting={isSubmitting}
          selectedCards={selectedCards}
        />
      </Container>

      <HorizontalDivider/>

      <Container>
        <Cards
          cards={cards}
          account={account}
          projects={projects}
          isLoading={isLoading}
          selectedCards={selectedCards}
          onChangeSelectedCard={onChangeSelectedCard}
        />
      </Container>
    </>
  )
};

export { LinkCards };
