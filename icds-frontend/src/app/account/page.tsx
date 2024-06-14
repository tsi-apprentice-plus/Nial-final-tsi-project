import MenuAppBar from "@/app/components/search";
import { getPosts } from "@/utils/route";
import { Posts } from "@/types/post";
import PostsList from "@/app/components/PostsList";
import { Suspense } from "react";

export default async function AccountPage() {
  const posts: Posts = await getPosts();
  const usersPosts = posts.filter((post) => post.userID === 99);
  return (
    <div>
      <Suspense>
        <MenuAppBar />
        <br />
        <PostsList posts={usersPosts} showDeletePost={true} />
      </Suspense>
    </div>
  );
}
export const dynamic = "force-dynamic";