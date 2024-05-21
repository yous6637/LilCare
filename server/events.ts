"use server";
import { Concrete, EventData } from "@/types";
import { db } from "../db/index";
import { events, schedules, services } from "@/db/schema";
import { toSql } from "@/lib/utils";
import { z } from "zod";
import { EventsInsertSchema } from "@/db/forms/formsSchema";
import { createService } from "./payment";
import { getTableColumns } from "drizzle-orm";



export async function getEvents(
  params?: Concrete<EventData>
): Promise<EventData[]> {
  const query = toSql(events, params);
  if (!query) return await db.select().from(events);
  const newEvents = await db.select().from(events).where(query);
  return newEvents;
}

export async function createEvent(params: z.infer<typeof EventsInsertSchema>) {
  try {
    // create service
    const createdService = await createService(params.service);
    const serviceId = createdService.service?.id;
    const prices = createdService.prices;

    if (!serviceId || !prices) throw new Error("Service not created");

    // create schedule

    const createdSchedule = await db
      .insert(schedules)
      .values(params.schedule)
      .returning(getTableColumns(schedules));
    const scheduleId = createdSchedule.at(0)?.id;
    // create event
    if (!scheduleId) throw new Error("Schedule not created");
    const response = await db
      .insert(events)
      .values({
        scheduleId: scheduleId, // Add the scheduleId property
        serviceId,
        title: params.title,
        photo: params.photo,
        description: params.description,
        metadata: { prices, schedule: createdSchedule?.at(0)  },
      })
      .returning(getTableColumns(events));

    return { data: response, error: null };
  } catch (error) {
    const err = error as Error;
    return { data: null, error: err.message };
  }
}
