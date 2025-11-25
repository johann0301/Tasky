"use client";

import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { Button } from "./button";
import { useSession, signOut } from "next-auth/react";
import { LogOut, User, LogIn, ListTodo, Plus } from "lucide-react";
import Link from "next/link";
import { useTaskStore } from "@/features/TaskManager/store/taskStore";
import { usePathname } from "next/navigation";

export function Navbar() {
  const { data: session, status } = useSession();
  const isLoading = status === "loading";
  const pathname = usePathname();
  const openCreateModal = useTaskStore((state) => state.openCreateModal);

  const userInitials = session?.user?.name
    ? session.user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : session?.user?.email?.[0]?.toUpperCase() ?? "U";

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="border-b bg-background">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link
          href={session?.user ? "/tasks" : "/"}
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <h1 className="text-xl font-bold">Tasky</h1>
        </Link>

        <div className="flex items-center gap-4">
          {isLoading ? (
            <div className="h-10 w-20 animate-pulse rounded bg-muted" />
          ) : session?.user ? (
            <>
              {/* Links de Navegação */}
              <div className="hidden md:flex items-center gap-1">
                <Button
                  asChild
                  variant={isActive("/tasks") ? "secondary" : "ghost"}
                  size="sm"
                >
                  <Link href="/tasks">
                    <ListTodo className="mr-2 h-4 w-4" />
                    Tarefas
                  </Link>
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  onClick={openCreateModal}
                  className="ml-2"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Nova Tarefa
                </Button>
              </div>

              {/* Menu Mobile */}
              <div className="md:hidden">
                <Button
                  variant="default"
                  size="sm"
                  onClick={openCreateModal}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {/* Avatar Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 rounded-full focus:outline-none focus:ring-2 focus:ring-ring hover:opacity-80 transition-opacity">
                    <Avatar>
                      <AvatarImage src={session.user.image ?? undefined} />
                      <AvatarFallback>{userInitials}</AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {session.user.name ?? "Usuário"}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {session.user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/tasks" className="flex items-center w-full">
                      <ListTodo className="mr-2 h-4 w-4" />
                      Tarefas
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="flex items-center w-full">
                      <User className="mr-2 h-4 w-4" />
                      Perfil
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="text-red-600 focus:text-red-600 cursor-pointer"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sair
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Button asChild variant="ghost">
                <Link href="/auth/login">
                  <LogIn className="mr-2 h-4 w-4" />
                  Entrar
                </Link>
              </Button>
              <Button asChild>
                <Link href="/auth/register">Cadastrar</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
