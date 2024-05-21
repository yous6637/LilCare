import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { supabaseServer } from "@/lib/supabase/server";
import InitUser from "@/lib/store/InitUser";
import { ThemeProvider } from "@/lib/store/theme-provider";
const space_Grotesk = Space_Grotesk({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "LilCare",
  description: "Created by Youcef Gagi",
};

export  default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

	const supabase = await supabaseServer();

		const channel = supabase.channel("room1");
		channel
			.on("presence", { event: "sync" }, () => {
				const userIds = [];
				for (const id in channel.presenceState()) {
					// @ts-ignore
					userIds.push(channel.presenceState()[id][0].user_id);
				}
			})
			.subscribe(async (status) => {
				if (status === "SUBSCRIBED") {
					await channel.track({
						online_at: new Date().toISOString(),
					});
				}
			});
  return (
    <html lang="en">
      <body className={space_Grotesk.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
          
        >
          {children}
          <Toaster position="top-center" />
        </ThemeProvider>
        <InitUser />
        <video id="a1">
          <source src="https://d6cp9b00-a.akamaihd.net/downloads/ringtones/files/mp3/facebook-messenger-tone-wapking-fm-mp3-17015-19072-43455.mp3" type="audio/mpeg"></source>
        </video>
      </body>
    </html>
  );
}
