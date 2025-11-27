import { format, formatDistance, isPast, isFuture, differenceInDays } from "date-fns";
import { ptBR } from "date-fns/locale/pt-BR";

export function formatShortDate(date: Date | string): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return format(dateObj, "dd MMM", { locale: ptBR });
}

export function formatFullDate(date: Date | string): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return format(dateObj, "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
}

export function formatDateTime(date: Date | string): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return format(dateObj, "dd MMM yyyy 'às' HH:mm", { locale: ptBR });
}

export function formatRelativeDate(date: Date | string): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return formatDistance(dateObj, new Date(), {
    addSuffix: true,
    locale: ptBR,
  });
}

export function isDatePast(date: Date | string): boolean {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return isPast(dateObj);
}

export function isDateFuture(date: Date | string): boolean {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return isFuture(dateObj);
}

export function getDaysDifference(date1: Date | string, date2: Date | string): number {
  const date1Obj = typeof date1 === "string" ? new Date(date1) : date1;
  const date2Obj = typeof date2 === "string" ? new Date(date2) : date2;
  return differenceInDays(date1Obj, date2Obj);
}

export function isOverdue(date: Date | string | null, isCompleted: boolean): boolean {
  if (!date) return false;
  if (isCompleted) return false;
  return isDatePast(date);
}

/**
 * Converte uma string de data no formato "yyyy-MM-dd" para um objeto Date
 * que representa meia-noite no timezone local, evitando problemas de conversão UTC.
 * 
 * Quando você faz new Date("2025-11-27"), o JavaScript interpreta como UTC meia-noite,
 * e ao converter para timezone local (ex: UTC-3 no Brasil), vira o dia anterior.
 * 
 * Esta função garante que a data seja criada no timezone local.
 * 
 * @param dateString - String de data no formato "yyyy-MM-dd"
 * @returns Date representando meia-noite no timezone local
 */
export function parseLocalDate(dateString: string): Date {
  const [year, month, day] = dateString.split("-").map(Number);
  // Cria a data no timezone local (não UTC)
  return new Date(year, month - 1, day);
}

