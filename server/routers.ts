import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { psychologicalTestResults } from "../drizzle/schema";
import { getDb } from "./db";
import { sendResultToAdmin, sendResultToUserEmail } from "./email";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  // Versão: Zoho Mail SMTP integrado (2026-07-08)
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  questionnaire: router({
    sendUserEmail: publicProcedure
      .input(
        z.object({
          userEmail: z.string().email(),
          fullName: z.string().min(1),
          psychologicalType: z.string().length(4),
          scores: z.object({
            E: z.number(),
            I: z.number(),
            S: z.number(),
            N: z.number(),
            T: z.number(),
            F: z.number(),
            J: z.number(),
            P: z.number(),
          }),
        })
      )
      .mutation(async ({ input }) => {
        try {
          await sendResultToUserEmail(
            input.userEmail,
            input.fullName,
            input.psychologicalType,
            input.scores
          );
          return { success: true };
        } catch (error) {
          console.error("Erro ao enviar e-mail para o usuário:", error);
          throw new Error("Erro ao enviar e-mail");
        }
      }),
    saveResult: publicProcedure
      .input(
        z.object({
          fullName: z.string().min(1),
          psychologicalType: z.string().length(4),
          answers: z.record(z.string(), z.enum(["a", "b"])),
          scores: z.object({
            E: z.number(),
            I: z.number(),
            S: z.number(),
            N: z.number(),
            T: z.number(),
            F: z.number(),
            J: z.number(),
            P: z.number(),
          }),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const db = await getDb();
        if (!db) {
          throw new Error("Database not available");
        }

        // Inserir resultado no banco de dados
        try {
          console.log("[DEBUG] Iniciando INSERT no banco de dados...");
          console.log("[DEBUG] fullName:", input.fullName);
          console.log("[DEBUG] psychologicalType:", input.psychologicalType);
          console.log("[DEBUG] ipAddress:", ctx.req.headers["x-forwarded-for"] || "unknown");
          
          await db.insert(psychologicalTestResults).values({
            fullName: input.fullName,
            psychologicalType: input.psychologicalType,
            answers: JSON.stringify(input.answers),
            scores: JSON.stringify(input.scores),
            ipAddress: (ctx.req.headers["x-forwarded-for"] as string) || "unknown",
          });
          
          console.log("[DEBUG] INSERT concluido com sucesso");
        } catch (dbError) {
          console.error("[ERROR] Erro ao inserir no banco de dados:");
          console.error("[ERROR] Tipo:", dbError instanceof Error ? dbError.constructor.name : typeof dbError);
          console.error("[ERROR] Mensagem:", dbError instanceof Error ? dbError.message : String(dbError));
          if (dbError instanceof Error && dbError.stack) {
            console.error("[ERROR] Stack trace:", dbError.stack);
          }
          throw dbError;
        }

        // Enviar resultado para o e-mail do administrador
        try {
          console.log("[DEBUG] Iniciando envio para administrador...");
          console.log("[DEBUG] Nome:", input.fullName);
          console.log("[DEBUG] Tipo:", input.psychologicalType);
          const result = await sendResultToAdmin(
            input.fullName,
            input.psychologicalType,
            input.scores
          );
          console.log("[DEBUG] Resultado do envio:", result);
          if (result === false) {
            console.error("[ERROR] notifyOwner retornou false - servico de notificacao indisponivel");
          } else {
            console.log("[DEBUG] Envio concluido com sucesso");
          }
        } catch (error) {
          console.error("[ERROR] Erro ao enviar resultado ao administrador:", error);
          throw error;
        }

        return {
          success: true,
        };
      }),
  }),
});

export type AppRouter = typeof appRouter;
