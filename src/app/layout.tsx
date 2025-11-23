import type { Metadata } from "next";
import "./globals.css";
import { TRPCProvider } from "./_trpc/Provider";

export const metadata: Metadata = {
  title: "Desafio Ale",
  description: "Aplicação T3 Stack",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>
        <TRPCProvider>{children}</TRPCProvider>
      </body>
    </html>
  );
}
