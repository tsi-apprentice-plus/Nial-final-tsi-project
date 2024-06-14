import FullPost from "@/app/components/FullPost";
import MenuAppBar from "@/app/components/search";
import { getPosts } from "@/utils/route";
import { Post } from "@/types/post";

export default async function PostPage({
  params,
}: Readonly<{ params: { id: string } }>) {
  const post: Post = await getPosts(params.id);
  return (
    <div>
      <MenuAppBar />
      <FullPost key={post._id?.toString()} {...post} />
    </div>
  );
}
