import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/en";
import { Posts } from "../types/post";
import PostCard from "./PostCard";

dayjs.extend(relativeTime);
dayjs.locale("en");

type PostsListProps = {
  posts: Posts;
};
export default async function PostsList({ posts }: Readonly<PostsListProps>) {
  return (
    <div className="container mx-auto px-4">
      <div className="text-2xl font-bold text-gray-800 my-4">Posts</div>
      <br />
      <div className="grid grid-cols-1 gap-4">
        {posts.map((post) => (
          <PostCard key={post._id?.toString()} {...post} />
        ))}
      </div>
    </div>
  );
}
