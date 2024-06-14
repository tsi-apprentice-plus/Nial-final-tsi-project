import MenuAppBar from "@/app/components/search";
import { getPostsUser, getUser } from "@/utils/route";
import { Posts } from "@/types/post";
import PostsList from "@/app/components/PostsList";
import { Suspense } from "react";
import UserHeader from "@/app/components/UserHeader";
import { User } from "@/types/user";

export default async function AccountPage({
  params,
}: Readonly<{ params: { userid: number } }>) {
  const { userid } = params;
  const usersPosts: Posts = await getPostsUser(userid);
  const users = await getUser(userid);
  const user: User = users[0];
  console.log(usersPosts);
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <MenuAppBar />
        <br />
        <UserHeader user={user} />
        <br />
        <PostsList posts={usersPosts} showDeletePost={true} />
      </Suspense>
    </div>
  );
}
export const dynamic = "force-dynamic";
