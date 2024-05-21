import { PostgresJsDatabase, drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as schema from './schema'


const DATABASE_URL="postgres://postgres.egrsstxcjchpqgschypq:G2A0G0I1@youcef@aws-0-eu-central-1.pooler.supabase.com:5432/postgres"



const pgClient = postgres(DATABASE_URL)
export const DB  = drizzle(pgClient, {schema : schema });
declare global {
    var db : PostgresJsDatabase<typeof schema> | undefined;
    var window : Window & typeof globalThis
    
  }
  
  export const db = globalThis.db || DB ;
  
  if (process.env.NODE_ENV !== "production") globalThis.db = db;
  
  
