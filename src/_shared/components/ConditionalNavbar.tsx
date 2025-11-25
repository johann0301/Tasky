"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "./Navbar";

export function ConditionalNavbar() {
  const pathname = usePathname();
  
  // Não mostrar Navbar na landing page (/)
  if (pathname === "/") {
    return null;
  }
  
  return <Navbar />;
}

