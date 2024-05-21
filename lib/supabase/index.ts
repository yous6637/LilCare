import { SupabaseClient } from "@supabase/supabase-js";
import { supabaseBrowser } from "./browser";
import { supabaseServer } from "./server";





const supabaseServerObj =  supabaseServer();
const supabaseBrowserObj =  supabaseBrowser();

declare global {
    var supabaseServerObj : SupabaseClient;
    var supabaseBrowserObj : SupabaseClient
    
  }
  
export const supaServerObj = globalThis.supabaseServerObj || supabaseServerObj ;
export const supaBrowserObj = globalThis.supabaseBrowserObj || supabaseBrowserObj ;

  