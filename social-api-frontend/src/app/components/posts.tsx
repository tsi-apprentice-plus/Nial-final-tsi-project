// import { useState } from 'react';
import { getPost } from '../../utils/api';
import { Avatar, Box, Card, CardContent, CardHeader, Typography } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime'; // Import relativeTime plugin for dayjs
import 'dayjs/locale/en'; // Import English locale for dayjs
import { Posts } from '../types/post';

dayjs.extend(relativeTime); // Enable relativeTime plugin
dayjs.locale('en'); // Set locale to English

export default async function ListPosts() {
  // const [loading, setLoading] = useState(true);

  function formatNumber(number: number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  const posts: Posts = await getPost();

  return (
    <div>
        <div>
          {posts.map((post) => (
            <Card key={post._id} className="mb-4">
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
                <Typography variant="body1">{post.content}</Typography>
              </CardContent>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <ThumbUpIcon color="primary" fontSize="small" />
                  <Typography variant="body2" color="textSecondary">
                    {formatNumber(post.likes.length)} Likes
                  </Typography>
                </Box>
                <Box display="flex" alignItems="center">
                  <ChatBubbleOutlineIcon fontSize="small" />
                  <Typography variant="body2" color="textSecondary">
                    {formatNumber(post.comments.length)} Comments
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          ))}
        </div>
    </div>
  );
}
