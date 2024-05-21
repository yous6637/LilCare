"use client";
import React from "react";
import EventsForm from "@/components/forms/EventForm";
import Sidebar from "@/components/Sidebar";
import { createEvent } from "@/server/events";
import { toast } from "sonner";

type Props = {};

const Page = (props: Props) => {
  return (
    <div className="flex h-full">
      <Sidebar active="Events" />
      <div className="container overflow-auto">
        <EventsForm
          onSubmit={async (data) => {
            console.log(data);
            const { error , data: res} = await createEvent(data);
            if (error) {
              toast.error(`${error}`);
              return;
            }
            toast.success("Event created successfully");
          }}
        />
      </div>
    </div>
  );
};

export default Page;
