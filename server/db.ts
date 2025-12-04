import { eq, desc, like, or, and, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { 
  InsertUser, 
  users, 
  memorialProfiles, 
  InsertMemorialProfile,
  memorialPhotos,
  InsertMemorialPhoto,
  memorialMessages,
  InsertMemorialMessage,
  activities,
  InsertActivity
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Memorial Profiles
export async function createMemorialProfile(profile: InsertMemorialProfile) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const [result] = await db.insert(memorialProfiles).values(profile);
  return Number(result.insertId);
}

export async function getMemorialProfileById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(memorialProfiles).where(eq(memorialProfiles.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getMemorialProfilesByCreator(creatorId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(memorialProfiles).where(eq(memorialProfiles.creatorId, creatorId)).orderBy(desc(memorialProfiles.createdAt));
}

export async function updateMemorialProfile(id: number, updates: Partial<InsertMemorialProfile>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(memorialProfiles).set(updates).where(eq(memorialProfiles.id, id));
}

export async function deleteMemorialProfile(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.delete(memorialProfiles).where(eq(memorialProfiles.id, id));
}

export async function searchMemorialProfiles(query: string) {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(memorialProfiles)
    .where(like(memorialProfiles.name, `%${query}%`))
    .orderBy(desc(memorialProfiles.createdAt))
    .limit(50);
}

export async function incrementVisitCount(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(memorialProfiles)
    .set({ visitCount: sql`${memorialProfiles.visitCount} + 1` })
    .where(eq(memorialProfiles.id, id));
}

export async function getAllMemorialProfiles(limit: number = 20) {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(memorialProfiles).orderBy(desc(memorialProfiles.createdAt)).limit(limit);
}

// Memorial Photos
export async function addMemorialPhoto(photo: InsertMemorialPhoto) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const [result] = await db.insert(memorialPhotos).values(photo);
  return Number(result.insertId);
}

export async function getMemorialPhotos(memorialId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(memorialPhotos)
    .where(eq(memorialPhotos.memorialId, memorialId))
    .orderBy(desc(memorialPhotos.createdAt));
}

export async function deleteMemorialPhoto(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.delete(memorialPhotos).where(eq(memorialPhotos.id, id));
}

// Memorial Messages
export async function addMemorialMessage(message: InsertMemorialMessage) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const [result] = await db.insert(memorialMessages).values(message);
  return Number(result.insertId);
}

export async function getMemorialMessages(memorialId: number, includeHidden: boolean = false) {
  const db = await getDb();
  if (!db) return [];
  
  const conditions = includeHidden 
    ? eq(memorialMessages.memorialId, memorialId)
    : and(eq(memorialMessages.memorialId, memorialId), eq(memorialMessages.isHidden, false));
  
  return db.select().from(memorialMessages)
    .where(conditions)
    .orderBy(desc(memorialMessages.createdAt));
}

export async function reportMessage(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(memorialMessages)
    .set({ isReported: true })
    .where(eq(memorialMessages.id, id));
}

export async function hideMessage(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(memorialMessages)
    .set({ isHidden: true })
    .where(eq(memorialMessages.id, id));
}

export async function unhideMessage(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(memorialMessages)
    .set({ isHidden: false, isReported: false })
    .where(eq(memorialMessages.id, id));
}

export async function getReportedMessages() {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(memorialMessages)
    .where(eq(memorialMessages.isReported, true))
    .orderBy(desc(memorialMessages.createdAt));
}

// Activities
export async function createActivity(activity: InsertActivity) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.insert(activities).values(activity);
}

export async function getRecentActivities(limit: number = 20) {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(activities)
    .orderBy(desc(activities.createdAt))
    .limit(limit);
}
