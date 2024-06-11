import MenuAppBar from "@/app/components/nosearch";
import { getPosts } from "@/utils/route";
import { Posts } from "@/app/types/post";
import PostsList from "@/app/components/PostsList";

interface Props {
  searchParams: { page?: number };
}

export default async function AccountPage({ searchParams }: Props) {
  const { page } = searchParams;
  const posts: Posts = await getPosts();
  const usersPosts = posts.filter((post) => post.userID === 99);
  return (
    <div>
      <MenuAppBar />
      <PostsList posts={usersPosts} />
    </div>
  );
}
