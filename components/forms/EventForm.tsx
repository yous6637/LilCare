"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "../ui/input";
import {
  EventsInsertSchema,
  SectionsInsertSchema,
} from "@/db/forms/formsSchema";
import { Textarea } from "@/components/ui/textarea";
import { Inbox, Loader2 } from "lucide-react";
import { useState } from "react";
import { postImage } from "@/lib/apis";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ApiState } from "@/lib/hooks";
import { PriceData, ScheduleInsert, ServiceInsert } from "@/types";
import { metadata } from "@/app/layout";

const formSchema = EventsInsertSchema;

type FormData = z.infer<typeof formSchema>;

type FormProps = {
  default?: FormData;
  onSubmit?: (data: FormData) => Promise<any>;
  onCancel?: () => void;
};


export default function EventForm({onSubmit, onCancel}: FormProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [image, setImage] = useState<File>();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const checkSubmit = async (data: FormData) => {
    // Handle form Last Check before submission  logic here
    // e.g., send POST request to your API endpoint to add the parent to the database
    const serviceParams = {
      name: data.title,
      description: data.description,
      dtype: "event" as "event",
      prices: data.service.prices,
      Images: [""],
      metadata: {
        prices: data.service.prices,
      }
    } as ServiceInsert & {
      prices: PriceData[]
    } ;

    if (image) {
      setIsUploading(true);
      let imageRes = await postImage({ file: image });
      serviceParams.Images = [imageRes.url];
      data.photo = imageRes.url;
      setIsUploading(false);
    }
    data.service = serviceParams;
    const schedule : ScheduleInsert = {
      title: data.title,
      description: data.description,
      type: "event", 
      start: data.schedule.start,
      end: data.schedule.end,
    };
    data.schedule = schedule;

    console.log("Data: ", data);
    onSubmit?.(data);
  };
  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("Handle image called");
    const selectedFile = e.target?.files?.item(0);
    if (selectedFile) {
      const reader = new FileReader();
      setImage(selectedFile);
      reader.readAsDataURL(selectedFile);
      reader.onload = (ev: ProgressEvent<FileReader>) => {
        const imageData = ev.target?.result as string;
        console.log("imageData: ", imageData);
        form.setValue("photo", imageData); // Store the Base64-encoded image data
      };
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          checkSubmit(form.getValues());
        }}
        className="space-y-6"
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Event Name:</FormLabel>
              <FormControl>
                <Input onChange={field.onChange} defaultValue={field.value} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid-cols-2 gap-3 w-full">
          <FormField
            control={form.control}
            name="photo"
            render={({ field }) => (
              <FormItem className="grid-cols-1">
                <FormLabel htmlFor="photo" className="cursor-pointer">
                  <Avatar className="rounded-md w-full h-32 object-cover border-2 border-white shadow">
                    <AvatarImage src={form.watch().photo} />
                    <AvatarFallback>
                      {isUploading ? (
                        <div className="border-dashed border-2 rounded-xl cursor-pointer bg-gray-50 py-8 px-2 flex flex-col justify-center items-center">
                          <Loader2 className="h-10 w-10 text-blue-500 animate-spin" />
                          <p className="mt-2 text-sm text-slate-400">
                            Uploading...
                          </p>
                        </div>
                      ) : (
                        <div className="border-dashed border-2 rounded-xl cursor-pointer bg-gray-50 py-8 px-2 flex flex-col justify-center items-center">
                          <Inbox className="w-10 h-10 text-blue-500" />
                          <p className="mt-2 text-sm text-slate-400 text-center">
                            Drag file here, or click to select files
                          </p>
                        </div>
                      )}
                    </AvatarFallback>
                  </Avatar>
                </FormLabel>
                <FormControl>
                  <Input
                    className="hidden"
                    id="photo"
                    type="file"
                    onChange={handleImage}
                  />
                </FormControl>
                {/* <FormLabel htmlFor="photo">
                  <div className="border-dashed border-2 rounded-xl cursor-pointer bg-gray-50 py-8 px-2 flex flex-col justify-center items-center"></div>
                </FormLabel> */}

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="schedule.start"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Event Date</FormLabel>
                <Input
                  type="datetime-local"
                  value={field.value}
                  onChange={(e) => {
                    form.setValue("schedule.start", e.target.value);
                  }}
                />

                <FormDescription>
                  When the upcoming events are scheduled
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="schedule.end"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Event End: </FormLabel>
                <Input
                  type="datetime-local"
                  value={field.value}
                  onChange={(e) => {
                    form.setValue("schedule.end", e.target.value);
                  }}
                />

                <FormDescription>
                  When the upcoming events are scheduled
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="service.prices.0.type"
            render={({ field }) => (
              <FormItem className="grid-cols-1">
                <FormLabel>Prices :</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a Subscription type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Once">Once</SelectItem>
                    <SelectItem value="Month">Monthly</SelectItem>
                    <SelectItem value="Year">Yearly</SelectItem>
                    <SelectItem value="Quarter">quarter</SelectItem>
                  </SelectContent>
                </Select>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="service.prices.0.price"
            render={({ field }) => (
              <FormItem className="grid-cols-2">
                <FormLabel>Amount :</FormLabel>
                <Input
                  value={field.value}
                  type="number"
                  onChange={(e) => {
                    form.setValue(
                      "service.prices.0.price",
                      parseInt(e.target.value)
                    );
                  }}
                />
                <FormDescription>Price of this event enrollment </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description:</FormLabel>
                <FormControl>
                  <Textarea
                    onChange={field.onChange}
                    defaultValue={field.value}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex justify-end gap-3 mt-4">
          <Button
            type="button"
            onClick={() => {
              onCancel?.();
              form.reset();
            }}
            variant="secondary"
          >
            Cancel
          </Button>
         
          <Button type="submit" className="">
            Submit
          </Button>
        </div>
      </form>
    </Form>
  );
}
