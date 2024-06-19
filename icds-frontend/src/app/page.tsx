import TopBar from "@/components/TopBar";
import HomepageContent from "@/components/homepageContent";
import { Suspense } from "react";
import { getSession } from "@auth0/nextjs-auth0";
import { redirect } from "next/navigation";

interface Props {
  searchParams: { query?: string; page?: number };
}

export default async function Homepage({ searchParams }: Readonly<Props>) {
  const user = (await getSession()) as { user: any };
  console.log("User", user);
  if (user) {
    console.log("User logged in", user);
  }
  if (!user) {
    redirect("/api/auth/login");
  }
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TopBar showSearch />
      <HomepageContent searchParams={searchParams} />
    </Suspense>
  );
}
