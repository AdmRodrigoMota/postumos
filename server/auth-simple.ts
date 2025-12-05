import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { users } from "../drizzle/schema";
import { getDb } from "./db";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { ENV } from "./_core/env";

export const authRouter = router({
  // Registro de novo usuário
  register: publicProcedure
    .input(
      z.object({
        name: z.string().min(2),
        email: z.string().email(),
        password: z.string().min(6),
      })
    )
    .mutation(async ({ input }) => {
      // Verificar se email já existe
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      const existing = await db.select().from(users).where(eq(users.email, input.email)).limit(1);
      if (existing.length > 0) {
        throw new Error("Email já cadastrado");
      }

      // Hash da senha
      const hashedPassword = await bcrypt.hash(input.password, 10);

      // Criar usuário
      const [user] = await db.insert(users).values({
        name: input.name,
        email: input.email,
        password: hashedPassword,
        loginMethod: "email",
        openId: `email_${Date.now()}_${Math.random()}`,
      });

      // Gerar token JWT
      const token = jwt.sign(
        { userId: user.insertId, email: input.email },
        ENV.cookieSecret,
        { expiresIn: "30d" }
      );

      return { success: true, token, userId: user.insertId };
    }),

  // Login
  login: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      // Buscar usuário
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.email, input.email))
        .limit(1);

      if (!user || !user.password) {
        throw new Error("Email ou senha inválidos");
      }

      // Verificar senha
      const valid = await bcrypt.compare(input.password, user.password);
      if (!valid) {
        throw new Error("Email ou senha inválidos");
      }

      // Atualizar lastSignedIn
      await db.update(users).set({ lastSignedIn: new Date() }).where(eq(users.id, user.id));

      // Gerar token JWT
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        ENV.cookieSecret,
        { expiresIn: "30d" }
      );

      return { success: true, token, user: { id: user.id, name: user.name, email: user.email } };
    }),

  // Obter usuário atual (via token)
  me: protectedProcedure.query(async ({ ctx }) => {
    return ctx.user;
  }),

  // Logout
  logout: protectedProcedure.mutation(async () => {
    return { success: true };
  }),
});
