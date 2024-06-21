"use client";
import { IcTypography } from "@ukic/react";
import Image from "next/image";

interface Props {
  username: string;
  user?: any;
}

export default function UserHeader({ username, user }: Readonly<Props>) {
  return (
    <div className="flex justify-center">
      <div className="bg-white p-4 rounded-lg shadow-md w-fit dark:bg-gray-800">
        <IcTypography variant="h4">@{user?.nickname ?? username}</IcTypography>
        <IcTypography variant="caption">{user?.email}</IcTypography>
        <IcTypography variant="caption">{user?.name}</IcTypography>
        <Image src={user?.picture} alt="profile picture" width={100} height={100} />
      </div>
    </div>
  );
}
