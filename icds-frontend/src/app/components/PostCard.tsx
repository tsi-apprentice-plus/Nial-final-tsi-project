"use client";

import { IcCard, IcButton } from "@ukic/react";
import { Post } from "@/types/post";
import Icon from "@mdi/react";
import {
  mdiCommentOutline,
  mdiThumbUpOutline,
  mdiThumbUp,
  mdiAccount,
} from "@mdi/js";
import { useState } from "react";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/en";
dayjs.extend(relativeTime);
dayjs.locale("en");

import { likePost, unlikePost } from "@/utils/route";

export default function PostCard(post: Readonly<Post>) {
  const userliked = post.likes.some((like) => Number(like.userID) === 99);

  const [liked, setLiked] = useState<boolean>(userliked);
  const [likeCount, setLikeCount] = useState(post.likes.length);

  async function likeHandler() {
    const newliked = !liked;
    setLiked(newliked);
    if (!post._id) return;
    if (newliked) {
      await likePost(post._id);
    } else {
      await unlikePost(post._id);
    }
    setLikeCount(newliked ? likeCount + 1 : likeCount - 1);
  }
  return (
    <div data-testid="post-item">
      <IcCard
        heading={String(post.userID)}
        subheading={dayjs(post.timestamp).fromNow()}
        message={post.content}
        className="bg-white shadow-md rounded-lg"
      >
        <Icon path={mdiAccount} size={1} />
        <div
          slot="interaction-controls"
          style={{ display: "flex", gap: "16px" }}
        >
          <IcButton onClick={likeHandler}>
            <Icon path={liked ? mdiThumbUp : mdiThumbUpOutline} size={1} />
            {likeCount} Likes
          </IcButton>
          <IcButton>
            <Icon path={mdiCommentOutline} size={1} />
            {post.comments.length}
          </IcButton>
        </div>
      </IcCard>
    </div>
  );
}
