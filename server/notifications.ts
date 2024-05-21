"use server"
import { eq } from 'drizzle-orm';
import { db } from '../db/index';
import { notifications } from '../db/schema';
import { supabaseServer } from '../lib/supabase/server';
import { NextResponse } from 'next/server';














export const getNotifications = async () => {

    const supabase = await supabaseServer()
    const currentUser  = (await supabase.auth.getSession()).data.session?.user
    if (currentUser) {
    const resuls = await db.select().from(notifications).where(eq(notifications.user_id, currentUser?.id));

    return resuls
    } else {

        return NextResponse.error()
     }

}