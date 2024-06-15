import TopBar from "@/components/TopBar";
import HomepageContent from "@/components/homepageContent";
import { Suspense } from "react";

interface Props {
  searchParams: { query?: string; page?: number };
}

export default async function Homepage({ searchParams }: Readonly<Props>) {

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TopBar showSearch />
      <HomepageContent searchParams={searchParams} />
    </Suspense>
  );
}
