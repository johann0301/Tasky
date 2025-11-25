import Link from "next/link";
import { HelpCircle, MessageCircle } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-muted/50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="text-center md:text-left">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Tasky. Todos os direitos reservados.
            </p>
          </div>
          <div className="flex items-center gap-6">
            <Link
              href="/faq"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <HelpCircle className="h-4 w-4" />
              FAQ
            </Link>
            <Link
              href="/help"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <MessageCircle className="h-4 w-4" />
              Ajuda
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

