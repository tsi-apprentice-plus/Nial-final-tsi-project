"use client";
import { IcTypography } from "@ukic/react";
import { User } from "@/types/user";
import { use } from "react";

interface Props {
  username: string;
  user?: any;
}

export default function UserHeader({ username, user }: Readonly<Props>) {
  return (
    <div className="flex justify-center">
      <div className="bg-white p-4 rounded-lg shadow-md w-fit">
        <IcTypography variant="h4">@{user?.nickname ?? username}</IcTypography>
        <IcTypography variant="caption">{user?.email}</IcTypography>
        <IcTypography variant="caption">{user?.name}</IcTypography>
      </div>
    </div>
  );
}
