import Search from "./components/search";
import HomepageContent from "./components/homepageContent";
import { Suspense } from "react";

interface Props {
  searchParams: { query?: string; page?: number };
}

export default async function Homepage({ searchParams }: Readonly<Props>) {
  console.log("my params are", searchParams);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Search />
      <HomepageContent searchParams={searchParams} />
    </Suspense>
  );
}
