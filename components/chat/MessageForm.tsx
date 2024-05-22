"use client";
import React, { useState } from "react";
import { Input } from "../ui/input";
import { supabaseBrowser } from "@/lib/supabase/browser";
import { toast } from "sonner";
import { randomInt } from "crypto";
import { useSearchParams } from "next/navigation";
import { Button, buttonVariants } from "../ui/button";
import {
  CircleEllipsis,
  CircleOffIcon,
  Loader2,
  LucideMessageCircleX,
  MessageCircleXIcon,
  Paperclip,
  SendIcon,
  SidebarCloseIcon,
} from "lucide-react";
import { promise, z } from "zod";
import { Form, FormField } from "../ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "@radix-ui/react-label";
import { postImage } from "@/lib/apis";
import { useMessagesTable, useSessionUser } from "@/lib/hooks";
import { ChatData, MessageInsert, UsersAuthSelect } from '@/types';
import { insertMessage } from "@/server/chat";
import { MessageInsertSchema } from "@/db/forms/formsSchema";

type Props = {
  sender: UsersAuthSelect;
  chat: ChatData;
  
};

const formSchema = MessageInsertSchema;

export default function MessageForm({ sender, chat }: Props) {
  const [images, setImages] = useState<File[]>([]);
  const [isSubmiting, setIsSubmiting] = useState<boolean>(false);
  const [imagesData, setImageData] = useState<string[]>([]);
  const { currentUser: user } = useSessionUser((state) => state);
  const params = useSearchParams().get("chatId") || undefined;

  const form = useForm({
    resolver: zodResolver(formSchema),
  });

  supabaseBrowser()
    .auth.getUser()
    .then((user) =>
      useSessionUser.setState({ currentUser: user?.data?.user || undefined })
    );


  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target?.files?.item(0);

    if (selectedFile) {
      const reader = new FileReader();
      setImages([...images, selectedFile]);
      reader.readAsDataURL(selectedFile);
      reader.onload = (ev: ProgressEvent<FileReader>) => {
        const imageData = ev.target?.result as string;
        setImageData([...imagesData, imageData]);
      };
    }
  };

  const handleSendMessage = async (text: string) => {
    if (text?.trim() || user?.id) {
      const files = await Promise.all(
        images.map((image) => postImage({ file: image }))
      );
      if (!user ) {
        toast.error("User not found!!");
        return
      }
      const newMessage = {
        text,
        chat: parseInt(params!),
        sender: user.id,
        createdAt: new Date(),
        files: files,
        metadata: { sender: user},
        isEdited:false,
      } as MessageInsert;
      const { data, error } = await insertMessage(newMessage);
      if (error) {
        toast.error(error.message);
        return;
      }
        form.reset()
        setImageData([])
        setImages([])
    } else {
      if (!user?.id) {
        toast.error("User not found!!");
        return
      }
      toast.error("Message can not be empty!!");
    }
  };

  return (
    <div className="p-5">
      <div className="flex gap-1">
        {imagesData.map((image, id) => (
          <div key={id} className="relative">
            <div className="absolute hover:first:flex w-full h-full ">
              <button
                onClick={(e) => {
                  console.log(e);
                  setImageData(imagesData.filter((i) => i !== image));
                }}
                className=" first:hidden  w-full h-full cursor-pointer flex bg-muted/50  justify-center items-center"
              >
                <LucideMessageCircleX className=" top-0 right-0 w-4 aspect-square" />
              </button>
            </div>

            <img className="w-18 h-16 object-cover" src={image} />
          </div>
        ))}
      </div>
      <Form {...form}>
        <form
          className="flex gap-2"
          onSubmit={async (e) => {
            setIsSubmiting(true);
            e.preventDefault();
            const res = await handleSendMessage(form.getValues().text);
            setIsSubmiting(false);
          }}
          action=""
        >
          <FormField
            name="file"
            control={form.control}
            render={({ field }) => (
              <>
                <Label
                  className={buttonVariants({ variant: "outline", size: "sm" })}
                  htmlFor="upload_file"
                >
                  <Paperclip />
                </Label>

                <Input
                  placeholder="send message"
                  onChange={(e) => {
                    handleImage(e);
                  }}
                  type="file"
                  id="upload_file"
                  className="hidden"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.currentTarget.value = "";
                    }
                  }}
                />
              </>
            )}
          />
          <FormField
            name="text"
            control={form.control}
            render={({ field }) => (
              <Input
                placeholder="send message"
                onChange={field.onChange}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.currentTarget.value = "";
                  }
                }}
              />
            )}
          />

          <Button size={"sm"} type="submit" variant={"primary"}>
            {" "}
            {!isSubmiting ? (
              <SendIcon />
            ) : (
              <Loader2 className="animate-spin" />
            )}{" "}
          </Button>
        </form>
      </Form>
      {/* <InitUser  /> */}
    </div>
  );
}
