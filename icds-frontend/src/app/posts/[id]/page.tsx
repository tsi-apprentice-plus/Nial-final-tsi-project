import FullPost from "@/components/FullPost";
import TopBar from "@/components/TopBar";
import { getSinglePost } from "@/utils/route";
import { Types } from "mongoose";
import { IPost } from "@/types/post";

export default async function PostPage({
  params,
}: Readonly<{ params: { id: Types.ObjectId } }>) {
  const post: IPost = await getSinglePost(params.id.toString());
  return (
    <div>
      <TopBar />
      <FullPost key={post._id?.toString()} {...post} />
    </div>
  );
}
