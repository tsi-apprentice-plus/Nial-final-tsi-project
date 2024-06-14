import MenuAppBar from "@/components/search";
import { getUsersPosts, getUser } from "@/utils/route";
import { Posts } from "@/types/post";
import PostsList from "@/components/PostsList";
import { Suspense } from "react";
import UserHeader from "@/components/UserHeader";
import { User } from "@/types/user";

export default async function AccountPage({
  params,
}: Readonly<{ params: { userid: number } }>) {
  const { userid } = params;
  const usersPosts: Posts = await getUsersPosts(userid);
  const user = await getUser(userid);
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
