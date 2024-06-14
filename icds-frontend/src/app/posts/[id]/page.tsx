import FullPost from "@/app/components/FullPost";
import MenuAppBar from "@/app/components/search";
import { getSinglePost } from "@/utils/route";
import { Types } from "mongoose";
import { PostWithUsername } from "@/types/post";

export default async function PostPage({
  params,
}: Readonly<{ params: { id: Types.ObjectId } }>) {
  const post: PostWithUsername = await getSinglePost(params.id.toString());
  console.log(post); 
  return (
    <div>
      <MenuAppBar />
      <FullPost key={post._id?.toString()} {...post} />
    </div>
  );
}
