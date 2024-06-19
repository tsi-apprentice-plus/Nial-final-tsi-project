"use client";
import { useDebouncedCallback } from "use-debounce";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useUser } from "@auth0/nextjs-auth0/client";

import {
  IcTopNavigation,
  SlottedSVG,
  IcSearchBar,
  IcNavigationItem,
  IcNavigationButton,
} from "@ukic/react";

interface Props {
  showSearch?: boolean;
}

export default function TopBar({ showSearch }: Readonly<Props>) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const handleSearch = useDebouncedCallback((e) => {
    const params = new URLSearchParams(searchParams);
    const term: string = e.detail.value;
    params.set("page", "1");
    if (term) {
      params.set("query", term);
    } else {
      params.delete("query");
    }
    replace(`${pathname}?${params.toString()}`);
  }, 300);

  const { user, error, isLoading } = useUser();
  const username = user?.nickname;

  return (
    <div>
      <IcTopNavigation appTitle="TSI">
        <SlottedSVG
          slot="app-icon"
          xmlns="http://www.w3.org/2000/svg"
          height="24px"
          viewBox="0 0 24 24"
          width="24px"
          fill="#000000"
        >
          <path d="M0 0h24v24H0V0z" fill="none" />
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-5.5-2.5l7.51-3.49L17.5 6.5 9.99 9.99 6.5 17.5zm5.5-6.6c.61 0 1.1.49 1.1 1.1s-.49 1.1-1.1 1.1-1.1-.49-1.1-1.1.49-1.1 1.1-1.1z" />
        </SlottedSVG>
        {showSearch && (
          <IcSearchBar
            slot="search"
            placeholder="Search"
            label="Search"
            onIcChange={handleSearch}
          />
        )}
        <IcNavigationButton label="Login" slot="buttons" href="/api/auth/login">
          <SlottedSVG
            slot="icon"
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 0 24 24"
            width="24px"
            fill="#000000"
          >
            <path d="M12,19.2C9.5,19.2 7.29,17.92 6,16C6.03,14 10,12.9 12,12.9C14,12.9 17.97,14 18,16C16.71,17.92 14.5,19.2 12,19.2M12,5A3,3 0 0,1 15,8A3,3 0 0,1 12,11A3,3 0 0,1 9,8A3,3 0 0,1 12,5M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12C22,6.47 17.5,2 12,2Z" />
          </SlottedSVG>
        </IcNavigationButton>
        <IcNavigationItem slot="navigation" label="Home" href="/" />
        <IcNavigationItem
          slot="navigation"
          label="My Account"
          href={`/account/${username}`}
        />
      </IcTopNavigation>
    </div>
  );
}
