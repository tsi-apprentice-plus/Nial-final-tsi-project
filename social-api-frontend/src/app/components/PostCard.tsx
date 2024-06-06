import { Avatar, Box, Card, CardContent, CardHeader, Typography } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/en';
dayjs.extend(relativeTime);
dayjs.locale('en');

import { Post } from '../types/post';

function formatNumber(number: number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export default function PostCard(post: Post) {
  return (
    <Card key={post._id} className="bg-white shadow-md rounded-lg">
    <CardHeader
      avatar={<Avatar>{post.userId ? post.userId.charAt(0) : ''}</Avatar>}
      title={post.userId}
      subheader={dayjs(post.timestamp).fromNow()} // Display relative time
      action={
        <Box display="flex" alignItems="center">
          <AccessTimeIcon fontSize="small" />
          <Typography variant="body2" color="textSecondary">
            {dayjs(post.timestamp).format('MMM D, YYYY h:mm A')} {/* Display formatted timestamp */}
          </Typography>
        </Box>
      }
    />
    <CardContent>
      <Typography variant="body1" className="text-gray-800">{post.content}</Typography>
    </CardContent>
    <CardContent className="flex justify-between items-center">
      <Box className="flex items-center">
        <ThumbUpIcon className="text-blue-500 mr-1" fontSize="small" />
        <Typography variant="body2" color="textSecondary" className="text-gray-600">
          {formatNumber(post.likes.length)} Likes
        </Typography>
      </Box>
      <Box className="flex items-center">
        <ChatBubbleOutlineIcon className="text-blue-500 mr-1" fontSize="small" />
        <Typography variant="body2" color="textSecondary" className="text-gray-600">
          {formatNumber(post.comments.length)} Comments
        </Typography>
      </Box>
    </CardContent>
  </Card>
  );
}