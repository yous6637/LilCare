import type { Config } from "drizzle-kit";

const uri = 'postgres://postgres.egrsstxcjchpqgschypq:G2A0G0I1@youcef@aws-0-eu-central-1.pooler.supabase.com:5432/postgres';

const url = new URL(uri);

const username = url.username; // 'postgres.egrsstxcjchpqgschypq'
const host = url.hostname; // 'aws-0-eu-central-1.pooler.supabase.com'
const urlValue = url.href; // 'postgres://postgres.egrsstxcjchpqgschypq:G2A0G0I1@youcef@aws-0-eu-central-1.pooler.supabase.com:5432/postgres'

export default {
    dialect: "postgresql",
    schema: './db/schema.ts',
    out: "./drizzle/",
    "dbCredentials" : {
        url: uri,

    }
    
} as Config ;
