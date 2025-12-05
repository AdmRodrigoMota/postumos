import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";
import { TRPCError } from "@trpc/server";
import { notifyOwner } from "./_core/notification";
import { uploadRouter } from "./upload";
import { authRouter } from "./auth-simple";

export const appRouter = router({
  system: systemRouter,
  upload: uploadRouter,
  auth: authRouter,

  memorial: router({
    create: protectedProcedure
      .input(z.object({
        name: z.string().min(1).max(255),
        photoUrl: z.string().optional(),
        photoKey: z.string().optional(),
        birthDate: z.date().optional(),
        deathDate: z.date().optional(),
        biography: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const memorialId = await db.createMemorialProfile({
          creatorId: ctx.user.id,
          ...input,
        });
        
        await db.createActivity({
          type: "profile_created",
          memorialId,
          userId: ctx.user.id,
        });

        await notifyOwner({
          title: "Novo Perfil Memorial Criado",
          content: `${ctx.user.name || ctx.user.email} criou um perfil memorial para ${input.name}.`,
        });
        
        return { id: memorialId };
      }),

    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        name: z.string().min(1).max(255).optional(),
        photoUrl: z.string().optional(),
        photoKey: z.string().optional(),
        birthDate: z.date().optional(),
        deathDate: z.date().optional(),
        biography: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const profile = await db.getMemorialProfileById(input.id);
        if (!profile) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Perfil memorial não encontrado" });
        }
        if (profile.creatorId !== ctx.user.id) {
          throw new TRPCError({ code: "FORBIDDEN", message: "Você não tem permissão para editar este perfil" });
        }
        
        const { id, ...updates } = input;
        await db.updateMemorialProfile(id, updates);
        return { success: true };
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input, ctx }) => {
        const memorial = await db.getMemorialProfileById(input.id);
        if (!memorial) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Memorial não encontrado" });
        }
        if (memorial.creatorId !== ctx.user.id) {
          throw new TRPCError({ code: "FORBIDDEN", message: "Você não tem permissão para excluir este memorial" });
        }
        await db.deleteMemorialProfile(input.id);
        return { success: true };
      }),

    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const profile = await db.getMemorialProfileById(input.id);
        if (!profile) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Perfil memorial não encontrado" });
        }
        
        await db.incrementVisitCount(input.id);
        return profile;
      }),

    getMyProfiles: protectedProcedure
      .query(async ({ ctx }) => {
        return db.getMemorialProfilesByCreator(ctx.user.id);
      }),

    search: publicProcedure
      .input(z.object({ query: z.string() }))
      .query(async ({ input }) => {
        return db.searchMemorialProfiles(input.query);
      }),

    getAll: publicProcedure
      .input(z.object({ limit: z.number().optional() }))
      .query(async ({ input }) => {
        return db.getAllMemorialProfiles(input.limit);
      }),

    listByCreator: protectedProcedure
      .query(async ({ ctx }) => {
        return db.getMemorialProfilesByCreator(ctx.user.id);
      }),
  }),

  photo: router({
    add: protectedProcedure
      .input(z.object({
        memorialId: z.number(),
        photoUrl: z.string(),
        photoKey: z.string(),
        caption: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const profile = await db.getMemorialProfileById(input.memorialId);
        if (!profile) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Perfil memorial não encontrado" });
        }
        
        const photoId = await db.addMemorialPhoto({
          ...input,
          uploadedBy: ctx.user.id,
        });
        
        await db.createActivity({
          type: "photo_added",
          memorialId: input.memorialId,
          userId: ctx.user.id,
        });
        
        return { id: photoId };
      }),

    getByMemorial: publicProcedure
      .input(z.object({ memorialId: z.number() }))
      .query(async ({ input }) => {
        return db.getMemorialPhotos(input.memorialId);
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.deleteMemorialPhoto(input.id);
        return { success: true };
      }),
  }),

  message: router({
    add: publicProcedure
      .input(z.object({
        memorialId: z.number(),
        content: z.string().min(1),
        authorName: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const profile = await db.getMemorialProfileById(input.memorialId);
        if (!profile) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Perfil memorial não encontrado" });
        }
        
        const messageId = await db.addMemorialMessage({
          memorialId: input.memorialId,
          authorId: ctx.user?.id,
          authorName: ctx.user ? ctx.user.name || undefined : input.authorName,
          content: input.content,
        });
        
        await db.createActivity({
          type: "message_posted",
          memorialId: input.memorialId,
          userId: ctx.user?.id,
        });
        
        return { id: messageId };
      }),

    getByMemorial: publicProcedure
      .input(z.object({ memorialId: z.number() }))
      .query(async ({ ctx, input }) => {
        const profile = await db.getMemorialProfileById(input.memorialId);
        if (!profile) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Perfil memorial não encontrado" });
        }
        
        const includeHidden = ctx.user?.id === profile.creatorId;
        return db.getMemorialMessages(input.memorialId, includeHidden);
      }),

    report: publicProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.reportMessage(input.id);
        
        await notifyOwner({
          title: "Mensagem Reportada para Moderação",
          content: `Uma mensagem foi reportada e requer moderação.`,
        });
        
        return { success: true };
      }),

    hide: protectedProcedure
      .input(z.object({ id: z.number(), memorialId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        const profile = await db.getMemorialProfileById(input.memorialId);
        if (!profile) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Perfil memorial não encontrado" });
        }
        if (profile.creatorId !== ctx.user.id) {
          throw new TRPCError({ code: "FORBIDDEN", message: "Você não tem permissão para moderar este perfil" });
        }
        
        await db.hideMessage(input.id);
        return { success: true };
      }),

    unhide: protectedProcedure
      .input(z.object({ id: z.number(), memorialId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        const profile = await db.getMemorialProfileById(input.memorialId);
        if (!profile) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Perfil memorial não encontrado" });
        }
        if (profile.creatorId !== ctx.user.id) {
          throw new TRPCError({ code: "FORBIDDEN", message: "Você não tem permissão para moderar este perfil" });
        }
        
        await db.unhideMessage(input.id);
        return { success: true };
      }),

    getReported: protectedProcedure
      .query(async () => {
        return db.getReportedMessages();
      }),
  }),

  activity: router({
    getRecent: publicProcedure
      .input(z.object({ limit: z.number().optional() }))
      .query(async ({ input }) => {
        return db.getRecentActivities(input.limit);
      }),
  }),
});

export type AppRouter = typeof appRouter;
