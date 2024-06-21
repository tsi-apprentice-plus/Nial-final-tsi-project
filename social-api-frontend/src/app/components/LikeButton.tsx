"use client";
import { Button, Box, Typography } from "@mui/material";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import { useState } from "react";

import formatNumber from "@/utils/formatNumber";
import { Post } from "../types/post";
import { handleLike } from "./PostCard";

type Props = {
  post: Post;
};

export default function LikeButton({ post }: Readonly<Props>) {
  const userliked = post.likes.some((like) => Number(like.userID) === 99);

  const [liked, setLiked] = useState<boolean>(userliked);
  const [likeCount, setLikeCount] = useState(post.likes.length);

  const onLikeClick = () => {
    const newliked = !liked;
    setLiked(newliked);

    handleLike(post._id, newliked).then(() => {
      setLiked(newliked);
      setLikeCount(newliked ? likeCount + 1 : likeCount - 1);
    });
  };
  return (
    <Box className="flex items-center">
      <Button onClick={onLikeClick}>
        {liked ? (
          <ThumbUpAltIcon className="text-blue-500 mr-1" fontSize="small" />
        ) : (
          <ThumbUpOffAltIcon className="text-blue-500 mr-1" fontSize="small" />
        )}
        <Typography
          variant="body2"
          color="textSecondary"
          className="text-gray-600"
        >
          {formatNumber(likeCount)} Likes
        </Typography>
      </Button>
    </Box>
  );
}
