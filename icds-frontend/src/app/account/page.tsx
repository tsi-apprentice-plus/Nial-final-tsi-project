import MenuAppBar from "@/app/components/search";
import { getPosts } from "@/utils/route";
import { Posts } from "@/types/post";
import PostsList from "@/app/components/PostsList";

export default async function AccountPage() {
  const posts: Posts = await getPosts();
  const usersPosts = posts.filter((post) => post.userID === 99);
  return (
    <div>
      <MenuAppBar />
      <br />
      <PostsList posts={usersPosts} showDeletePost={true} />
    </div>
  );
}
export const dynamic = "force-dynamic";
