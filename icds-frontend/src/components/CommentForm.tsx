"use client";
import { createComment, getSinglePost } from "@/utils/route";
import { useState } from "react";
import { IcButton } from "@ukic/react";
import { Types } from "mongoose";
import { Comments } from "@/types/post";
import { useUser } from "@auth0/nextjs-auth0/client";
import { useRouter } from 'next/navigation'

interface PostCommentProps {
  postid: Types.ObjectId;
  setComments: React.Dispatch<React.SetStateAction<Comments[]>>;
}

export default function CommentForm({
  postid,
  setComments,
}: Readonly<PostCommentProps>) {
  const router = useRouter()
  const [comment, setComment] = useState<string>("");
  const { user } = useUser();
  async function replyHandler(postID: Types.ObjectId, content: string) {
    if (!content) return;
    if (!user) {
      router.push('/api/auth/login')
    } else {
    await createComment(postID, content);
    const newComments = await getSinglePost(postID.toString());
    setComments(newComments.comments);
    setComment("");
    }
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
