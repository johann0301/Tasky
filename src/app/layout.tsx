import type { Metadata } from "next";
import "./globals.css";
import { TRPCProvider } from "./_trpc/Provider";
import { SessionProvider } from "./_trpc/SessionProvider";
import { ConditionalNavbar } from "@/shared/components/ConditionalNavbar";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "Tasky",
  description: "Gerencie suas tarefas com facilidade",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>
        <SessionProvider>
          <TRPCProvider>
            <ConditionalNavbar />
            <main className="min-h-screen">
              {children}
            </main>
            <Toaster />
          </TRPCProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
