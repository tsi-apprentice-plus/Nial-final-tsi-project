"use client";
import { IcTypography } from "@ukic/react";
import { User } from "@/types/user";
import { useUser } from "@auth0/nextjs-auth0/client";

interface Props {
  userx: Readonly<User>;
}

export default function UserHeader({ userx }: Readonly<Props>) {
  const { user } = useUser();
  return (
    <div className="flex justify-center">
      <div className="bg-white p-4 rounded-lg shadow-md w-fit">
        <IcTypography variant="h4">@{user?.nickname}</IcTypography>
        <IcTypography variant="caption">{user?.email}</IcTypography>
        <IcTypography variant="caption">{user?.name}</IcTypography>
      </div>
    </div>
  );
}
