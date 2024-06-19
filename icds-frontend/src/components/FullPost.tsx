"use client";
import { Comments, IPost } from "@/types/post";
import { IcButton, IcTypography, IcLink } from "@ukic/react";
import { likePost, unlikePost } from "@/utils/route";
import { useState, useEffect } from "react";
import Icon from "@mdi/react";
import { mdiCommentOutline, mdiThumbUpOutline, mdiThumbUp } from "@mdi/js";
import Comment from "@/components/Comment";
import CommentForm from "@/components/CommentForm";
import { useUser } from '@auth0/nextjs-auth0/client';

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/en";

dayjs.extend(relativeTime);
dayjs.locale("en");

export default function FullPost(post: Readonly<IPost>) {
  const { user, error, isLoading } = useUser();
  const [liked, setLiked] = useState<boolean>(false);
  const [likeCount, setLikeCount] = useState(post.likes.length);
  const [comments, setComments] = useState<Comments[]>(post.comments);

  useEffect(() => {
    if (!isLoading && user) {
      const userliked = post.likes.some((like) => like.username === user.nickname);
      setLiked(userliked);
    }
  }, [isLoading, user, post.likes]);

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
    <div className="px-4 py-3 max-w-7xl">
      <div className="bg-white p-4 rounded-lg shadow-md mb-4">
        <div className="">
          <IcLink href={`/account/${post.username}`}>@{post.username}</IcLink>
          <IcTypography>{post.content}</IcTypography>
          <br />
          <IcTypography variant="caption">
            {dayjs(post.timestamp).fromNow()}
          </IcTypography>
          <div className="flex justify-around py-2 border-t-2">
            <IcButton
              onClick={likeHandler}
              data-testid="like-button-fullscreen"
            >
              <Icon
                path={liked ? mdiThumbUp : mdiThumbUpOutline}
                size={1}
                className="group flex items-center gap-1.5 p-0 transition-none disabled:cursor-not-allowed inner:transition inner:duration-200 hover:text-accent-blue focus-visible:text-accent-blue"
              />
              <p className="inline-block pl-1">{likeCount}</p>
            </IcButton>
            <IcButton>
              <Icon
                path={mdiCommentOutline}
                size={1}
                className="group flex items-center gap-1.5 p-0 "
              />
              <p className="inline-block pl-1">{post.comments.length}</p>
            </IcButton>
          </div>
          <div className="border-t-2">
            <CommentForm postid={post._id} setComments={setComments} />
          </div>
          <div className="border-t-2">
            {comments.map((comment, index) => (
              <Comment key={index} {...comment} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}