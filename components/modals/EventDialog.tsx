import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import DiscountForm from "../forms/payment/DiscountFrom";
import { clickOn } from "@/lib/helpers";
import { createDiscount } from "@/server/payment";
import { toast } from "sonner";
import { DiscountData, EventData } from "@/types";
import EventForm from "../forms/EventForm";
import { createEvent } from "@/server/events";
import { eventFormSchema } from "@/db/forms";
import { EventsInsertSchema } from "@/db/forms/formsSchema";


type Props = {
    onSubmit?: (data: EventData) => void;
    onCancel?: () => void;
    
} 

export function EventDialog({onSubmit, onCancel}: Props) {
  return (
    <Dialog>
      <DialogTrigger id="event-trigger" asChild>
        <Button variant="outline">Add Event</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create Event</DialogTitle>
          <DialogDescription>
            Create Events for your customers.
          </DialogDescription>
        </DialogHeader>
        <EventForm
          onSubmit={async (params) => {
            const { error, data } = await createEvent(params);
            if (data) {
              toast.success("Event created successfully");
                onSubmit?.(data.at(0) as EventData);
            } else {
              toast.error(error);
            }
            setTimeout(() => {
              clickOn("event-trigger");
            }, 1000);
          }}
          onCancel={() => {
            clickOn("event-trigger");
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
