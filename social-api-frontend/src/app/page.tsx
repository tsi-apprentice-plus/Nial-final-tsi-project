import PostsList from "./components/PostsList";
import { getPostSearchPaged } from "@/utils/route";
import { Posts } from "./types/post";
import Pagination from "./components/Pagination";
import PrimarySearchAppBar from "./components/search";
import CreatePost from "./components/CreatePost";

interface Props {
  searchParams: { query?: string; page?: number };
}

export default async function Homepage({ searchParams }: Props) {
  console.log("my params are", searchParams);
  const { query, page } = searchParams;
  const posts: Posts = await getPostSearchPaged(25, page || 1, query || "");
  const postLength = posts.length;
  return (
    <div>
      <PrimarySearchAppBar placeholder="Search posts..." />
      <CreatePost />
      <PostsList posts={posts} />
      <br />
      <Pagination postLength={postLength} />
    </div>
  );
}
