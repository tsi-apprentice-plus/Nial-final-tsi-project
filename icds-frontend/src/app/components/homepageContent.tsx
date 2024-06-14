import { Posts } from "@/types/post";
import CreatePost from "./CreatePost";
import PostsList from "./PostsList";
import Pagination from "./Pagination";
import { getPostSearchPaged, getPosts } from "@/utils/route";

interface Props {
  searchParams: { query?: string; page?: number };
}

export default async function HomepageContent({
  searchParams,
}: Readonly<Props>) {
  const { query, page } = searchParams;
  const pages: number = Math.ceil((await getPosts()).length / 25);
  const posts: Posts = await getPostSearchPaged(25, page ?? 1, query ?? "");
  return (
    <div>
      <CreatePost />
      <br />
      <PostsList posts={posts} />
      <br />
      <Pagination pages={pages} />
    </div>
  );
}
