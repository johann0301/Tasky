"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "./Navbar";
import Link from "next/link";

export function ConditionalNavbar() {
  const pathname = usePathname();
  
  // Não mostrar Navbar na landing page (/)
  if (pathname === "/") {
    return null;
  }
  
  // Páginas públicas que só precisam do logo (stats, faq, help, auth)
  const publicPagesWithSimpleNav = ["/stats", "/faq", "/help"];
  const isAuthPage = pathname?.startsWith("/auth/");
  
  if (publicPagesWithSimpleNav.includes(pathname) || isAuthPage) {
    return (
      <nav className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-md shadow-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link
            href="/"
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <h1 className="text-xl font-bold">Tasky</h1>
          </Link>
        </div>
      </nav>
    );
  }
  
  return <Navbar />;
}

