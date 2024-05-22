"use client";
import React, { useEffect, useRef, useState } from "react";
import { User } from "@supabase/supabase-js";
import { DeleteAlert, EditAlert } from "./MessasgeActions";

import { useMessagesTable } from "@/lib/hooks";
import { useSearchParams } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase/browser";
import { ArrowDown } from "lucide-react";
import { Badge } from "../ui/badge";
import Message from "./Message";
import { ChatData, ChatMessage, MessageData, UserAuthData } from "@/types";

type Props = {
  messages: MessageData[];
  user: User;
  currentChat?: ChatData;
  chatMembers?: UserAuthData[];
};

const MessageList = ({
  currentChat,
  messages: dbMessages,
  user,
}: Props) => {
  const params = useSearchParams().get("chatId") || undefined;

  const scrollRef = useRef() as React.MutableRefObject<HTMLDivElement>;

  const [notification, setNotification] = useState(0);

  const [userScrolled, setUserScrolled] = useState(false);


  const [currentUser, setCurrentUser] = useState<User>();

  const { data: stateMessages, addRow } = useMessagesTable((state) => ({
    ...state,
    data: dbMessages,
  }));

  useEffect(() => {
    useMessagesTable.setState({ data: dbMessages });
  }, [dbMessages]);

  const supabase = supabaseBrowser();

  useEffect(() => {
    supabase.auth.getUser().then((session) => {
      const userSession = session.data;

      setCurrentUser({ ...userSession, ...user });
    });
  }, []);

  useEffect(() => {
    const channel = supabase
      .channel("chat-room")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "message" },
        async (payload) => {
          console.log(payload.new);

          const newMessage = payload.new as MessageData;
          useMessagesTable.setState((state) => ({data : [...state.data,newMessage]}));
          const senderId = payload.new?.sender!;
          const currentUserId = currentUser?.id;
          console.log({ senderId, currentUserId, payload });
          if (senderId !== currentUserId) {
            const audio = document.getElementById?.("a1") as HTMLAudioElement;
            audio.play();
          }
        }
      )

      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "message" },
        (payload) => {
          useMessagesTable.setState({
            data: stateMessages.filter((message) => message.id !== payload.old.id),
          });
        }
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "message" },
        (payload) => {
          const updateMessage = payload.new as MessageData;
          useMessagesTable.setState((state) => {
            return {
              data: state.data.filter((message) => {
                if (message.id === updateMessage.id) {
                  (message.text = updateMessage.text),
                    (message.isEdited = updateMessage.isEdited);
                }
                return message;
              }),
            };
          });
        }
      )
      .subscribe();
    scrollDown();

    return () => {
      channel.unsubscribe();
    };
  }, [stateMessages]);

  const handleOnScroll = () => {
    const scrollContainer = scrollRef.current;
    if (scrollContainer) {
      const isScroll =
        scrollContainer.scrollTop <
        scrollContainer.scrollHeight - scrollContainer.clientHeight - 10;
      setUserScrolled(isScroll);
      if (
        scrollContainer.scrollTop ===
        scrollContainer.scrollHeight - scrollContainer.clientHeight
      ) {
        setNotification(0);
      }
    }
  };
  const scrollDown = () => {
    setNotification(0);
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  };
  return (
    <>
      <div
        id="messages"
        className="flex h-full flex-[1] pb-2 overflow-auto  flex-col gap-2 px-4"
        ref={scrollRef}
        onScroll={handleOnScroll}
      >
        <div className="flex justify-center">
          <Badge variant={"secondary"} className="my-2 self-center ">
            {" "}
            {currentChat?.createdAt.toDateString()}{" "}
          </Badge>
        </div>
        <div className="flex flex-col gap-2">
          {useMessagesTable.getState().data?.map((message) => {
            return (
              <Message
                key={message.id}
                message={message}
                currentUser={currentUser}
              />
            );
          })}
        </div>
        <DeleteAlert />
        <EditAlert />
      </div>

      {userScrolled && (
        <div className=" absolute bottom-20 w-full">
          {notification ? (
            <div
              className="w-36 mx-auto bg-indigo-500 p-1 rounded-md cursor-pointer"
              onClick={scrollDown}
            >
              <h1>New {notification} messages</h1>
            </div>
          ) : (
            <div
              className="w-10 h-10 text-destructive-foreground bg-blue-500 rounded-full justify-center items-center flex mx-auto border cursor-pointer hover:scale-110 transition-all"
              onClick={scrollDown}
            >
              <ArrowDown />
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default MessageList;
