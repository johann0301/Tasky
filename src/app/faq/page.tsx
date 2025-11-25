import type { Metadata } from "next";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/shared/components/accordion";
import { HelpCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Perguntas Frequentes - Tasky",
  description:
    "Encontre respostas para as perguntas mais frequentes sobre o Tasky, nossa plataforma de gerenciamento de tarefas.",
  keywords: ["FAQ", "perguntas frequentes", "ajuda", "tasky", "tarefas"],
  openGraph: {
    title: "Perguntas Frequentes - Tasky",
    description: "Encontre respostas para as perguntas mais frequentes sobre o Tasky.",
    type: "website",
  },
};

const faqs = [
  {
    question: "Como criar uma nova tarefa?",
    answer:
      "Para criar uma nova tarefa, clique no botão 'Nova Tarefa' localizado na barra de navegação ou na página de tarefas. Preencha o título (obrigatório), descrição (opcional), defina o status, prioridade e data de vencimento, se desejar. Clique em 'Criar' para salvar sua tarefa.",
  },
  {
    question: "Como alterar o status de uma tarefa?",
    answer:
      "Você pode alterar o status de uma tarefa de duas formas: 1) Na visualização Kanban, use os botões de navegação (setas) nos cards para mover a tarefa entre as colunas (A Fazer, Em Progresso, Concluídas). 2) Na visualização em lista ou detalhes, clique no menu de opções (três pontos) e selecione 'Editar' para modificar o status manualmente.",
  },
  {
    question: "Qual a diferença entre visualização em Lista e Kanban?",
    answer:
      "A visualização em Lista mostra todas as suas tarefas em formato de grid, ideal para visualizar muitas tarefas de uma vez e usar filtros avançados. A visualização Kanban organiza as tarefas em três colunas (A Fazer, Em Progresso, Concluídas), permitindo arrastar e mover tarefas visualmente entre os status. Você pode alternar entre as duas visualizações usando os botões no topo da página de tarefas.",
  },
  {
    question: "Como definir prioridades para minhas tarefas?",
    answer:
      "Ao criar ou editar uma tarefa, você pode selecionar a prioridade no campo correspondente. As opções são: Baixa, Média ou Alta. A prioridade ajuda a identificar quais tarefas são mais urgentes e importantes, permitindo que você organize melhor seu trabalho.",
  },
  {
    question: "Minhas tarefas são privadas?",
    answer:
      "Sim, todas as suas tarefas são completamente privadas. Cada usuário só pode ver e gerenciar suas próprias tarefas. Utilizamos autenticação segura com NextAuth v5 para garantir que seus dados estejam protegidos e acessíveis apenas por você.",
  },
];

export default function FAQPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mx-auto max-w-3xl">
        <div className="mb-12 text-center">
          <div className="mb-4 flex justify-center">
            <HelpCircle className="h-12 w-12 text-primary" />
          </div>
          <h1 className="mb-4 text-4xl font-bold">Perguntas Frequentes</h1>
          <p className="text-lg text-muted-foreground">
            Encontre respostas para as dúvidas mais comuns sobre o Tasky
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left font-semibold">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="mt-12 rounded-lg border bg-muted/50 p-6 text-center">
          <p className="mb-4 text-lg font-medium">
            Não encontrou a resposta que procurava?
          </p>
          <p className="text-muted-foreground">
            Entre em contato conosco através da{" "}
            <a
              href="/help"
              className="font-medium text-primary hover:underline"
            >
              página de ajuda
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}

