import Link from "next/link";
import { Button } from "@/shared/components/button";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <h1 className="text-4xl font-bold mb-4">Tarefa não encontrada</h1>
      <p className="text-muted-foreground mb-8">
        A tarefa que você está procurando não existe ou você não tem permissão para visualizá-la.
      </p>
      <Button asChild>
        <Link href="/tasks">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para lista de tarefas
        </Link>
      </Button>
    </div>
  );
}
