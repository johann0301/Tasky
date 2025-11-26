import { z } from "zod";
import { eq, and, desc, or, like } from "drizzle-orm";
import { sql } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { protectedProcedure, router } from "../trpc";
import { db } from "@/lib/db";
import { tasks } from "@/database/schema";
import { taskCreationRatelimit } from "@/lib/ratelimit";

const taskStatusEnum = z.enum(["todo", "in-progress", "done"]);
const taskPriorityEnum = z.enum(["low", "medium", "high"]);

const taskFilterSchema = z.object({
  status: taskStatusEnum.optional(),
  priority: taskPriorityEnum.optional(),
  search: z.string().optional(),
});

const createTaskSchema = z.object({
  title: z.string().min(1, "Título é obrigatório").max(255, "Título muito longo"),
  description: z.string().optional(),
  status: taskStatusEnum.default("todo"),
  priority: taskPriorityEnum.default("medium"),
  dueDate: z.date().optional(),
});

const updateTaskSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1).max(255).optional(),
  description: z.string().optional(),
  status: taskStatusEnum.optional(),
  priority: taskPriorityEnum.optional(),
  dueDate: z.date().nullable().optional(),
});

export const taskRouter = router({
  getAll: protectedProcedure
    .input(taskFilterSchema.optional())
    .query(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      
      const conditions = [eq(tasks.userId, userId)];

      if (input?.status) {
        conditions.push(eq(tasks.status, input.status));
      }

      if (input?.priority) {
        conditions.push(eq(tasks.priority, input.priority));
      }

      if (input?.search) {
        const searchTerm = `%${input.search}%`;
        conditions.push(
          or(
            like(tasks.title, searchTerm),
            sql`COALESCE(${tasks.description}, '') ILIKE ${searchTerm}`
          )!
        );
      }

      const userTasks = await db
        .select()
        .from(tasks)
        .where(and(...conditions))
        .orderBy(desc(tasks.createdAt));

      return userTasks;
    }),

  getById: protectedProcedure
    .input(z.object({ id: z.string().min(1) }))
    .query(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      const [task] = await db
        .select()
        .from(tasks)
        .where(and(eq(tasks.id, input.id), eq(tasks.userId, userId)))
        .limit(1);

      if (!task) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Tarefa não encontrada",
        });
      }

      return task;
    }),

  create: protectedProcedure
    .input(createTaskSchema)
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      // Rate limiting: 5 tasks/minute
      const { success, limit, remaining } = await taskCreationRatelimit.limit(userId);

      if (!success) {
        throw new TRPCError({
          code: "TOO_MANY_REQUESTS",
          message: `Limite de criação de tarefas excedido. Você pode criar ${limit} tarefas por minuto. Tente novamente em breve.`,
        });
      }

      const [newTask] = await db
        .insert(tasks)
        .values({
          title: input.title,
          description: input.description,
          status: input.status,
          priority: input.priority,
          dueDate: input.dueDate,
          userId,
        })
        .returning();

      return { task: newTask, remaining };
    }),

  update: protectedProcedure
    .input(updateTaskSchema)
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const { id, ...updateData } = input;

      // Check task belongs to user
      const [existingTask] = await db
        .select()
        .from(tasks)
        .where(and(eq(tasks.id, id), eq(tasks.userId, userId)))
        .limit(1);

      if (!existingTask) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Tarefa não encontrada",
        });
      }

      const [updatedTask] = await db
        .update(tasks)
        .set({
          ...updateData,
          updatedAt: new Date(),
        })
        .where(and(eq(tasks.id, id), eq(tasks.userId, userId)))
        .returning();

      return { task: updatedTask };
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      const [existingTask] = await db
        .select()
        .from(tasks)
        .where(and(eq(tasks.id, input.id), eq(tasks.userId, userId)))
        .limit(1);

      if (!existingTask) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Tarefa não encontrada",
        });
      }

      await db
        .delete(tasks)
        .where(and(eq(tasks.id, input.id), eq(tasks.userId, userId)));

      return { success: true };
    }),
});
