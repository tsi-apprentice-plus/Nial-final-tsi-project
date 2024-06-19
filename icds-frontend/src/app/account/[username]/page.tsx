import TopBar from "@/components/TopBar";
import { getUsersPosts } from "@/utils/route";
import { IPosts } from "@/types/post";
import PostsList from "@/components/PostsList";
import { Suspense } from "react";
import UserHeader from "@/components/UserHeader";
import { getSession } from "@auth0/nextjs-auth0";

export default async function AccountPage({
  params,
}: Readonly<{ params: { username: string } }>) {


  const username = params.username;
  const { user } = (await getSession()) as any;
  console.log("user", user);
  if (!user) {
    return null;
  }

  let showDeletePost = false;
  if (username === user.nickname) {
    showDeletePost = true;
  }
  const usersPosts: IPosts = await getUsersPosts(username);
  console.log(usersPosts);
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <TopBar />
        <br />
        <UserHeader userx={user} />
        <br />
        <PostsList posts={usersPosts} showDeletePost={showDeletePost} />
      </Suspense>
    </div>
  );
}
export const dynamic = "force-dynamic";
