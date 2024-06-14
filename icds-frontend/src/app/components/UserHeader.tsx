"use client";
import { IcTypography } from "@ukic/react";
import { User } from "@/types/user";

interface Props {
  user: Readonly<User>;
}

export default function UserHeader({ user }: Readonly<Props>) {
  return (
    <div className="flex justify-center">
      <div className="bg-white p-4 rounded-lg shadow-md w-fit">
        <IcTypography variant="h4">@{user.username}</IcTypography>
        <IcTypography variant="caption">{user.email}</IcTypography>
        <IcTypography variant="caption">{user.id}</IcTypography>
      </div>
    </div>
  );
}
