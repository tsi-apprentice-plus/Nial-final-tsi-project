import TopBar from "@/components/TopBar";
import { getUsersPosts, getUser } from "@/utils/route";
import { Posts } from "@/types/post";
import PostsList from "@/components/PostsList";
import { Suspense } from "react";
import UserHeader from "@/components/UserHeader";

export default async function AccountPage({ params }: Readonly<{ params: { userid: number } }>) {

  const userid = Number(params.userid);

  let showDeletePost = false;
  if (userid === 99) {
    showDeletePost = true;
  }
  const usersPosts: Posts = await getUsersPosts(userid);
  const user = await getUser(userid);
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <TopBar />
        <br />
        <UserHeader user={user} />
        <br />
        <PostsList posts={usersPosts} showDeletePost={showDeletePost} />
      </Suspense>
    </div>
  );
}
export const dynamic = "force-dynamic";
