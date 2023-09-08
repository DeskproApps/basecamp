import { Fragment } from "react";
import get from "lodash/get";
import size from "lodash/size";
import { Title, HorizontalDivider } from "@deskpro/app-sdk";
import { Comment } from "../../common";
import type { FC } from "react";
import type { CardComment } from "../../../services/basecamp/types";

type Props = {
  comments: CardComment[],
};

const Comments: FC<Props> = ({ comments }) => {
  return (
    <>
      <Title title={`Comments (${size(comments)})`} />

      {comments.map(({ id, creator, created_at, content }) => (
        <Fragment key={id}>
          <Comment
            name={get(creator, ["name"])}
            avatarUrl={get(creator, ["avatar_url"]) as string}
            date={new Date(created_at)}
            text={content}
          />
          <HorizontalDivider style={{ marginBottom: 10 }} />
        </Fragment>
      ))}
    </>
  );
};

export { Comments };
