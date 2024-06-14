"use client";
import { createComment, getPosts } from "@/utils/route";
import { useState } from "react";
import { IcButton } from "@ukic/react";
import { Types } from "mongoose";
import { Comments } from "@/types/post";

interface PostCommentProps {
  postid: Types.ObjectId;
  setComments: React.Dispatch<React.SetStateAction<Comments[]>>;
}

export default function CommentForm({postid, setComments} : Readonly<PostCommentProps>) {
  const [comment, setComment] = useState<string>("");

  async function replyHandler(postID: Types.ObjectId, content: string) {
    await createComment(postID, content);
    const newComments = await getPosts(postID.toString());
    setComments(newComments.comments);
  }
  return (
    <form className="flex flex-col -mx-4">
    <label className="hover-animation grid w-full grid-cols-[auto,1fr] gap-3 px-4 py-3 pt-3 pb-1">
      <textarea
        className="w-full min-w-0 resize-none bg-transparent text-xl outline-none"
        placeholder="Write a comment..."
        onChange={(e) => setComment(e.target.value)}
      />
      <IcButton
        className="px-4 py-1.5 font-bold"
        type="button"
        onClick={() => replyHandler(postid, comment)}
      >
        Reply
      </IcButton>
    </label>
  </form>
  );
}