import type { Config } from "drizzle-kit";
import {DATABASE_URL} from "@/lib/constant";


export default {
    dialect: "postgresql",
    schema: './db/schema.ts',
    out: "./drizzle/",
    "dbCredentials" : {
        url: DATABASE_URL,

    }
    
} as Config ;
