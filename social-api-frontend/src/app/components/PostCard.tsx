import { Box, Card, CardContent, CardHeader, Typography } from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import { likePost, unlikePost } from "@/utils/route";
import formatNumber from "@/utils/formatNumber";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/en";
dayjs.extend(relativeTime);
dayjs.locale("en");

import { Post } from "../types/post";
import LikeButton from "./LikeButton";

export async function handleLike(postId: Post["_id"], likeClicked: boolean) {
  if (!postId) return;
  if (likeClicked) {
    await likePost(postId);
  } else {
    await unlikePost(postId);
  }
}

export default function PostCard(post: Readonly<Post>) {
  return (
    <Card key={post._id?.toString()} className="bg-white shadow-md rounded-lg">
      <CardHeader
        // avatar={<Avatar>{post.userID ? post.userID.charAt(0) : ''}</Avatar>}
        title={post.userID}
        subheader={dayjs(post.timestamp).fromNow()} // Display relative time
        action={
          <Box display="flex" alignItems="center">
            <AccessTimeIcon fontSize="small" />
            <Typography variant="body2" color="textSecondary">
              {dayjs(post.timestamp).format("MMM D, YYYY h:mm A")}{" "}
              {/* Display formatted timestamp */}
            </Typography>
          </Box>
        }
      />
      <CardContent>
        <Typography variant="body1" className="text-gray-800">
          {post.content}
        </Typography>
      </CardContent>
      <CardContent className="flex justify-between items-center">
        <LikeButton post={post} />
        <Box className="flex items-center">
          <ChatBubbleOutlineIcon
            className="text-blue-500 mr-1"
            fontSize="small"
          />
          <Typography
            variant="body2"
            color="textSecondary"
            className="text-gray-600"
          >
            {formatNumber(post.comments.length)} Comments
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}
