"use server"

import { ScheduleInsert, ScheduleParams } from "@/types"
import { db } from '../db/index';
import { events, schedules } from "@/db/modules";
import { getTableColumns } from "drizzle-orm";
import { createService } from "./payment";
import { createEvent } from "./events";




export const createSchedule = async (schedule : ScheduleParams) => {

    try {
        const insertedSchedule = (await db.insert(schedules).values(schedule).returning(getTableColumns(schedules))).at(0);
        if (!insertedSchedule) throw new Error("failed to insert schedule")
        switch (schedule.type) {
            case "event":
                
                // const events = createEvent(schedule)
                // break;
        
            default:
                break;
        }
    } catch (error) {
        
    }






}