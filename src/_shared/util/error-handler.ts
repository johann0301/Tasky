import { z } from "zod";

/**
 * Extract the first error message from a ZodError or return a default message
 */
export function getZodErrorMessage(error: unknown, defaultMessage = "Dados inválidos"): string {
  if (error instanceof z.ZodError) {
    return error.issues[0]?.message ?? defaultMessage;
  }
  return defaultMessage;
}

