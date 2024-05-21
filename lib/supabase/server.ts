"use server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { Database } from "../types/supabase";

export const supabaseServer = () => {
	const cookieStore = cookies();

	return createServerClient<Database>(
		"https://egrsstxcjchpqgschypq.supabase.co",
		"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVncnNzdHhjamNocHFnc2NoeXBxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTU3OTc1MDUsImV4cCI6MjAzMTM3MzUwNX0.FfPAWtXcIQolxcCilmz_lwhkvAcWPz_nnmK9HR0Vfko",
		{
			cookies: {
				get(name: string) {
					return cookieStore.get(name)?.value;
				},
			},
		}
	);
};
