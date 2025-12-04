import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(userId: number = 1): { ctx: TrpcContext } {
  const user: AuthenticatedUser = {
    id: userId,
    openId: `test-user-${userId}`,
    email: `user${userId}@example.com`,
    name: `Test User ${userId}`,
    loginMethod: "manus",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const ctx: TrpcContext = {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };

  return { ctx };
}

function createPublicContext(): { ctx: TrpcContext } {
  const ctx: TrpcContext = {
    user: undefined,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };

  return { ctx };
}

describe("Memorial Profile Operations", () => {
  it("should create a memorial profile when authenticated", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.memorial.create({
      name: "João da Silva",
      birthDate: new Date("1950-01-15"),
      deathDate: new Date("2024-03-20"),
      biography: "Uma pessoa querida que será sempre lembrada.",
    });

    expect(result).toHaveProperty("id");
    expect(typeof result.id).toBe("number");
    expect(result.id).toBeGreaterThan(0);
  });

  it("should retrieve memorial profile by id", async () => {
    const { ctx: authCtx } = createAuthContext();
    const authCaller = appRouter.createCaller(authCtx);

    // Create a profile first
    const created = await authCaller.memorial.create({
      name: "Maria Santos",
      birthDate: new Date("1960-05-10"),
      deathDate: new Date("2024-02-15"),
    });

    // Retrieve it with public context
    const { ctx: publicCtx } = createPublicContext();
    const publicCaller = appRouter.createCaller(publicCtx);

    const profile = await publicCaller.memorial.getById({ id: created.id });

    expect(profile).toBeDefined();
    expect(profile?.name).toBe("Maria Santos");
    expect(profile?.visitCount).toBeGreaterThanOrEqual(0);
  });

  it("should search memorial profiles by name", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    // Create test profiles
    await caller.memorial.create({
      name: "Pedro Oliveira",
      birthDate: new Date("1945-08-20"),
      deathDate: new Date("2024-01-10"),
    });

    // Search
    const results = await caller.memorial.search({ query: "Pedro" });

    expect(Array.isArray(results)).toBe(true);
    expect(results.some((p) => p.name.includes("Pedro"))).toBe(true);
  });
});

describe("Photo Gallery Operations", () => {
  it("should add photo to memorial gallery when authenticated", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    // Create a memorial first
    const memorial = await caller.memorial.create({
      name: "Ana Costa",
      birthDate: new Date("1955-03-12"),
      deathDate: new Date("2024-04-05"),
    });

    // Add photo
    const photo = await caller.photo.add({
      memorialId: memorial.id,
      photoUrl: "https://example.com/photo.jpg",
      photoKey: "test-photo-key",
      caption: "Uma foto especial",
    });

    expect(photo).toHaveProperty("id");
    expect(typeof photo.id).toBe("number");
  });

  it("should retrieve photos for a memorial", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    // Create memorial and add photo
    const memorial = await caller.memorial.create({
      name: "Carlos Ferreira",
      birthDate: new Date("1948-11-30"),
      deathDate: new Date("2024-05-18"),
    });

    await caller.photo.add({
      memorialId: memorial.id,
      photoUrl: "https://example.com/photo1.jpg",
      photoKey: "test-photo-1",
    });

    // Retrieve photos
    const photos = await caller.photo.getByMemorial({ memorialId: memorial.id });

    expect(Array.isArray(photos)).toBe(true);
    expect(photos.length).toBeGreaterThanOrEqual(1);
  });
});

describe("Message Wall Operations", () => {
  it("should allow authenticated users to post messages", async () => {
    const { ctx: authCtx } = createAuthContext();
    const authCaller = appRouter.createCaller(authCtx);

    // Create memorial
    const memorial = await authCaller.memorial.create({
      name: "Lucia Almeida",
      birthDate: new Date("1952-07-22"),
      deathDate: new Date("2024-06-10"),
    });

    // Post message
    const message = await authCaller.message.add({
      memorialId: memorial.id,
      content: "Sentiremos sua falta. Descanse em paz.",
    });

    expect(message).toHaveProperty("id");
    expect(typeof message.id).toBe("number");
  });

  it("should allow public users to post messages with name", async () => {
    const { ctx: authCtx } = createAuthContext();
    const authCaller = appRouter.createCaller(authCtx);

    // Create memorial
    const memorial = await authCaller.memorial.create({
      name: "Roberto Lima",
      birthDate: new Date("1940-12-05"),
      deathDate: new Date("2024-07-25"),
    });

    // Post message as public user
    const { ctx: publicCtx } = createPublicContext();
    const publicCaller = appRouter.createCaller(publicCtx);

    const message = await publicCaller.message.add({
      memorialId: memorial.id,
      content: "Uma pessoa especial que sempre será lembrada.",
      authorName: "Visitante Anônimo",
    });

    expect(message).toHaveProperty("id");
  });

  it("should retrieve messages for a memorial", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    // Create memorial and add message
    const memorial = await caller.memorial.create({
      name: "Fernanda Souza",
      birthDate: new Date("1958-04-18"),
      deathDate: new Date("2024-08-12"),
    });

    await caller.message.add({
      memorialId: memorial.id,
      content: "Sempre em nossos corações.",
    });

    // Retrieve messages
    const messages = await caller.message.getByMemorial({ memorialId: memorial.id });

    expect(Array.isArray(messages)).toBe(true);
    expect(messages.length).toBeGreaterThanOrEqual(1);
  });
});

describe("Activity Feed", () => {
  it("should retrieve recent activities", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    // Create some activity
    await caller.memorial.create({
      name: "Teste Atividade",
      birthDate: new Date("1950-01-01"),
      deathDate: new Date("2024-01-01"),
    });

    // Get activities
    const activities = await caller.activity.getRecent({ limit: 10 });

    expect(Array.isArray(activities)).toBe(true);
  });
});
