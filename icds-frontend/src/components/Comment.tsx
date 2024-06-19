"use client";
import { IcTypography } from "@ukic/react";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/en";
import { Comments } from "@/types/post";
dayjs.extend(relativeTime);
dayjs.locale("en");

export default function Comment(comment: Readonly<Comments>) {
  return (
    <div className="grid grid-cols-[auto,1fr] gap-x-3 gap-y-1">
      <div className="">
        <IcTypography variant="h4" className="truncate">
          @{comment.username}
        </IcTypography>
        <IcTypography variant="caption">
          {dayjs(comment.timestamp).fromNow()}
        </IcTypography>
      </div>
      <IcTypography className="whitespace-pre-line break-words">
        {comment.content}
      </IcTypography>
    </div>
  );
}
