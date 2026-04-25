import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { DesignTokens, AppLayout, Toaster } from "@takaki/go-design-system";
import { Analytics } from "@vercel/analytics/react";
import { TaskGoSidebar } from "@/components/layout/sidebar";
import { createClient } from "@/lib/supabase/server";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "TaskGo",
  description: "PdMの設計貯金を守るツール",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <html
      lang="ja"
      className={`${inter.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var t=localStorage.getItem('taskgo-theme')||'light';if(t==='dark')document.documentElement.classList.add('dark');else document.documentElement.classList.remove('dark');})();`,
          }}
        />
        <DesignTokens primaryColor="#5E6AD2" primaryColorHover="#4F5BC0" />
      </head>
      <body className="min-h-full">
        {user ? (
          <AppLayout sidebar={<TaskGoSidebar />} mainClassName="overflow-auto">
            {children}
          </AppLayout>
        ) : (
          <main>{children}</main>
        )}
        <Toaster position="bottom-right" />
        <Analytics />
      </body>
    </html>
  );
}
