"use client";

import { IcCard, IcButton } from "@ukic/react";
import { Post } from "@/types/post";
import Icon from "@mdi/react";
import { Types } from "mongoose";
import {
  mdiCommentOutline,
  mdiThumbUpOutline,
  mdiThumbUp,
  mdiAccount,
} from "@mdi/js";
import { useState } from "react";
import { useRouter } from "next/navigation";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/en";
dayjs.extend(relativeTime);
dayjs.locale("en");

import { likePost, unlikePost, deletePost } from "@/utils/route";

interface PostCardProps {
  post: Readonly<Post>;
  showDelete?: boolean;
}

export default function PostCard({
  post,
  showDelete,
}: Readonly<PostCardProps>) {
  const router = useRouter();
  const userliked = post.likes.some((like) => Number(like.userID) === 99);
  const [liked, setLiked] = useState<boolean>(userliked);
  const [likeCount, setLikeCount] = useState(post.likes.length);

  async function likeHandler(e: React.MouseEvent<HTMLIcButtonElement>) {
    e.stopPropagation();
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
  async function deleteHandler(postId: Types.ObjectId, e: React.MouseEvent<HTMLIcButtonElement>) {
    e.stopPropagation();
    if (!postId) return;
    await deletePost(postId);
  }
  return (
    <div data-testid="post-item">
      <IcCard
        heading={String(post.userID)}
        subheading={dayjs(post.timestamp).fromNow()}
        message={post.content}
        className="bg-white shadow-md rounded-lg"
        clickable
        onClick={() => router.push(`/posts/${post._id}`)}
      >
        <Icon path={mdiAccount} size={1} />
        <div
          slot="interaction-controls"
          style={{ display: "flex", gap: "16px" }}
        >
          <IcButton onClick={likeHandler} data-testid="like-button">
            <Icon path={liked ? mdiThumbUp : mdiThumbUpOutline} size={1} />
            {likeCount}
          </IcButton>
          <IcButton>
            <Icon path={mdiCommentOutline} size={1} />
            {post.comments.length}
          </IcButton>
          {showDelete && (
            <IcButton
              variant="destructive"
              onClick={(e) => deleteHandler(post._id, e)}
            >
              Delete
            </IcButton>
          )}
        </div>
      </IcCard>
    </div>
  );
}
