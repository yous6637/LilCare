import React from "react";
import Image from "next/image";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { Avatar, AvatarImage } from "../ui/avatar";
import { cn } from "@/lib/utils";
import { useMessagesTable } from "@/lib/hooks";
import { ChatMessage, MessageData } from "@/types";
import { User } from "@supabase/supabase-js";


type Props = {
  message: MessageData;
  currentUser: User | undefined;
};


const Message: React.FC<Props> = ({ message, currentUser }) => {
  const isCurrentUser = message.metadata.sender?.id === currentUser?.id;

  const renderFile = (file: { url: string; type: string }, idx: number) => {
    switch (file.type) {
      case 'jpg' || 'jpeg' || 'png' || 'gif':
        return <img key={idx} src={file.url} alt="" className="max-w-full h-auto rounded-lg mb-2" />;
      case 'video':
        return (
          <video key={idx} controls className="max-w-full h-auto rounded-lg mb-2">
            <source src={file.url} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        );
      case 'pdf':
        return (
          <a
            key={idx}
            href={file.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block p-2 bg-gray-100 rounded-lg mb-2 text-red-600 hover:underline"
          >
            View PDF
          </a>
        );
      default:
        return (
          <a
            key={idx}
            href={file.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block p-2 bg-gray-100 rounded-lg mb-2 text-blue-600 hover:underline"
          >
            View Document
          </a>
        );
    }
  };

  return (
    <div
      key={message.id}
      className={cn("flex text-start  gap-1 items-end", {
        "pl-10 flex-row-reverse": isCurrentUser,
        "justify-start pr-10": !isCurrentUser,
      })}
    >
      {!isCurrentUser && (
        <Avatar className="flex-shrink-0">
          <AvatarImage
            className="w-8 h-8 rounded-full mb-1"
            src={message?.metadata.sender.user_metadata?.photo}
            alt="User avatar"
          />
        </Avatar>
      )}
      <div className="flex flex-col max-w-md">
        {message.files?.map((file, idx) => renderFile(file, idx))}
        <div
          className={cn(
            "rounded-lg px-3 text-sm py-1 shadow-md ring-1 ring-gray-900/10",
            {
              "bg-blue-600 text-white": isCurrentUser,
              "bg-secondary text-black": !isCurrentUser,
              "rounded-t-none": message.files?.length,
            }
          )}
        >
          <p className="whitespace-pre-wrap">{message.text}</p>
        </div>
      </div>
      {isCurrentUser && <MessageMenu message={message} />}
    </div>
  );
};

export default Message;

const MessageMenu = ({ message }: { message: MessageData }) => {
  const setActionMessage = useMessagesTable((state) => state.setInAction);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="first:hidden hover:first:block">
        <MoreHorizontal size={16} />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Action</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            document.getElementById("trigger-edit")?.click();
            setActionMessage?.(message);
          }}
        >
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            document.getElementById("trigger-delete")?.click();
            setActionMessage?.(message);
          }}
        >
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
