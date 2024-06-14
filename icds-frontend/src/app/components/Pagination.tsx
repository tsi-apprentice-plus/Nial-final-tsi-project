"use client";
import { IcPagination } from "@ukic/react";
import { usePathname, useSearchParams, useRouter } from "next/navigation";

interface PaginationProps {
  pages: number;
}

export default function Pagination({ pages }: Readonly<PaginationProps>) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function createQueryString(name: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set(name, value);
    return params.toString();
  }
  function changePage(pageNumber: number) {
    const query = createQueryString("page", pageNumber.toString());
    router.push(pathname + "?" + query);
  }

  function getCurrentPage() {
    return Number(searchParams.get("page")) || 1;
  }
  return (
    <div className="flex justify-center">
      <IcPagination
        onIcPageChange={(e) => changePage(e.detail.value)}
        pages={pages}
        currentPage={getCurrentPage()}
        className="flex justify-center w-fit"
      />
    </div>
  );
}
