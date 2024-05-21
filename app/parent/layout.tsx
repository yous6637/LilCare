import Navbar from "@/components/Navbar";

import { supabaseServer } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import React from "react";
import { headers } from "next/headers";
import { supaServerObj } from "@/lib/supabase";


export async function generateMetadata({
  params,
}: {
  params: Record<string, string>;
}) {
  const supabase = await supaServerObj;          
  const currentUser = (await supabase.auth.getUser()).data?.user;
  return {
    title: `Parent ${currentUser?.user_metadata.firstName} - ${currentUser?.user_metadata?.lastName}`,
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await supaServerObj;          
  const currentUser = (await supabase.auth.getUser()).data?.user;

  const headersList = headers();
  const fullUrl = headersList.get("path");

  if (!currentUser) {
    if (fullUrl) {
       redirect("/login?path=" + fullUrl);
    }
     redirect("/login");
  }

  if (currentUser?.user_metadata.role !== "PARENT") {
    return redirect(currentUser?.user_metadata.role.toLowerCase());
  }

  return (
    <div className="flex flex-1 flex-col h-screen overflow-hidden">
      <Navbar />

      <main className="">{children}</main>
    </div>
  );
}
