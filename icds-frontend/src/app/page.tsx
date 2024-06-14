import Search from "./components/search";
import HomepageContent from "./components/homepageContent";

interface Props {
  searchParams: { query?: string; page?: number };
}

export default async function Homepage({ searchParams }: Readonly<Props>) {
  console.log("my params are", searchParams);

  return (
    <div>
      <Search />
      <HomepageContent searchParams={searchParams} />
    </div>
  );
}
