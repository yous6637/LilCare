"use server"

import {
    EducationalScheduleData,
    NutritionInsert,
    ScheduleParams
} from "@/types"
import { db } from '@/db';
import {schedules, educationalSchedule, nutritionSchedule} from "@/db/modules";
import { getTableColumns } from "drizzle-orm";





interface ServerResponse<T> {
    data: T;
    error: null;
}

export const createSchedule = async (schedule : ScheduleParams) => {

    try {
        const insertedSchedule = (await db.insert(schedules).values(schedule).returning(getTableColumns(schedules))).at(0);
        if (!insertedSchedule) throw new Error("failed to insert schedule")
        return {data: insertedSchedule, error: null}
    } catch (error) {
        const err = error as Error;
        return {data: null, error: err?.message}
    }
}


export const createSectionSchedule = async (schedule : ScheduleParams) => {

    if (schedule.type === "education") {
        const {data: insertedSchedule, error} = await createSchedule(schedule);
        if (!insertedSchedule) return {data: null, error}
        const { education } = schedule;
        const schedule_id = insertedSchedule.id;
        const ed : EducationalScheduleData | undefined = (await db.insert(educationalSchedule).
        values({scheduleId: schedule_id, sectionId: education.sectionId, moduleId: education.moduleId}).returning(getTableColumns(educationalSchedule)))?.at(0);

        return {data: ed, error: null}

    }

    if (schedule.type === "nutrition") {
        const {data: insertedSchedule, error} = await createSchedule(schedule);
        if (!insertedSchedule) return {data: null, error}
        const { nutrition } = schedule;
        const schedule_id = insertedSchedule.id;
        const ed = await createNutrition({...nutrition, scheduleId: schedule_id});
        return {data: ed, error: null}
    }
}


export const createNutrition = async (nutrition : NutritionInsert) => {
try {
        const insertedSchedule = (await db.insert(nutritionSchedule).values(nutrition).returning(getTableColumns(schedules))).at(0);
        if (!insertedSchedule) throw new Error("failed to insert schedule")
        return {data: insertedSchedule, error: null}
    } catch (error) {
        const err = error as Error;
        return {data: null, error: err?.message}
    }
}



