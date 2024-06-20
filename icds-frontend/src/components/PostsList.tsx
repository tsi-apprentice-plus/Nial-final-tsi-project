import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/en";
import { IPosts } from "@/types/post";
import PostCard from "@/components/PostCard";

dayjs.extend(relativeTime);
dayjs.locale("en");

type PostsListProps = {
  posts: IPosts;
  showDeletePost?: boolean;
};
export default async function PostsList({
  posts,
  showDeletePost,
}: Readonly<PostsListProps>) {
  if (!Array.isArray(posts) || posts.length === 0) {
    return <div>No posts</div>;
  }
  return (
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 gap-4">
        {posts.map((post) => (
          <PostCard
            key={post._id.toString()}
            post={post}
            showDelete={showDeletePost}
          />
        ))}
      </div>
    </div>
  );
}
