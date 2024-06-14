import PostsList from "./components/PostsList";
import { getPostSearchPaged, getPosts } from "@/utils/route";
import { Posts } from "@/types/post";
import Search from "./components/search";
import Pagination from "./components/Pagination";
import CreatePost from "./components/CreatePost";
import { Suspense } from "react";

interface Props {
  searchParams: { query?: string; page?: number };
}

export default async function Homepage({ searchParams }: Readonly<Props>) {
  console.log("my params are", searchParams);
  const { query, page } = searchParams;
  const pages: number = Math.ceil((await getPosts()).length / 25);
  const posts: Posts = await getPostSearchPaged(25, page ?? 1, query ?? "");
  return (
    <div>
      <Suspense>
        <Search />
        <CreatePost />
        <br />
        <PostsList posts={posts} />
        <br />
        <Pagination pages={pages} />
      </Suspense>
    </div>
  );
}
