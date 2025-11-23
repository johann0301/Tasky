# Desafio Ale

Projeto construído com Next.js 15, tRPC v11, NextAuth v5, Drizzle ORM, PostgreSQL, Zustand e Tailwind/Shadcn.

## Stack Tecnológica

- Next.js 15 (App Router)
- tRPC v11
- NextAuth v5 (Beta)
- Drizzle ORM
- PostgreSQL
- Zustand
- Tailwind CSS + Shadcn/ui
- React 19

## Estrutura de Pastas

```
/
├── public/
├── database/
├── Components/
├── src/
│   ├── app/
│   ├── features/
│   ├── Config/
│   ├── lib/
│   ├── components/
│   ├── actions/
│   ├── style/
│   ├── tests/
│   └── _shared/
```

## Scripts

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Build para produção
- `npm run start` - Inicia o servidor de produção
- `npm run lint` - Executa o ESLint
- `npm run db:generate` - Gera migrations do Drizzle
- `npm run db:migrate` - Executa migrations
- `npm run db:push` - Push schema para o banco
- `npm run db:studio` - Abre o Drizzle Studio
