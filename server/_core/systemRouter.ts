import { z } from "zod";
import { notifyOwner } from "./notification";
import { adminProcedure, publicProcedure, router } from "./trpc";
import { ENV } from "./env";

// Buffer para armazenar logs de erro
const errorLogs: Array<{ timestamp: string; level: string; message: string; stack?: string }> = [];
const MAX_LOGS = 100;

// Interceptar console.error para capturar logs
const originalError = console.error;
console.error = function(...args: any[]) {
  originalError.apply(console, args);
  
  const message = args.map(arg => 
    typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
  ).join(' ');
  
  errorLogs.push({
    timestamp: new Date().toISOString(),
    level: 'ERROR',
    message,
    stack: args[0] instanceof Error ? args[0].stack : undefined,
  });
  
  if (errorLogs.length > MAX_LOGS) {
    errorLogs.shift();
  }
};

export const systemRouter = router({
  health: publicProcedure
    .input(
      z.object({
        timestamp: z.number().min(0, "timestamp cannot be negative"),
      })
    )
    .query(() => ({
      ok: true,
    })),

  notifyOwner: adminProcedure
    .input(
      z.object({
        title: z.string().min(1, "title is required"),
        content: z.string().min(1, "content is required"),
      })
    )
    .mutation(async ({ input }) => {
      const delivered = await notifyOwner(input);
      return {
        success: delivered,
      } as const;
    }),

  debugEnv: publicProcedure.query(() => {
    // Retornar informacoes sobre as variaveis de ambiente (sem expor valores sensiveis)
    return {
      gmailUserConfigured: !!ENV.gmailUser,
      gmailAppPasswordConfigured: !!ENV.gmailAppPassword,
      gmailUser: ENV.gmailUser ? "***" + ENV.gmailUser.slice(-10) : "NOT_SET",
      gmailAppPassword: ENV.gmailAppPassword ? "***" + ENV.gmailAppPassword.slice(-5) : "NOT_SET",
      nodeEnv: process.env.NODE_ENV,
      timestamp: new Date().toISOString(),
    };
  }),

  getLogs: publicProcedure.query(() => {
    return {
      logs: errorLogs,
      count: errorLogs.length,
      timestamp: new Date().toISOString(),
    };
  }),
});
