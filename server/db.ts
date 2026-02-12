import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, InsertDataset, datasets, InsertDashboard, dashboards, type DashboardConfig } from "../drizzle/schema";

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
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
    } else if (user.openId === ENV.ownerId) {
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

export async function getUser(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function createDataset(dataset: InsertDataset) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(datasets).values(dataset);
  return result;
}

export async function getDatasets(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.select().from(datasets).where(eq(datasets.userId, userId));
  return result;
}

export async function getDatasetById(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.select().from(datasets).where(eq(datasets.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function deleteDataset(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.delete(datasets).where(eq(datasets.id, id));
}

export async function createDashboard(dashboard: InsertDashboard) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(dashboards).values(dashboard);
  return result;
}

export async function getDashboards(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.select().from(dashboards).where(eq(dashboards.userId, userId));
  return result;
}

export async function getDashboardById(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.select().from(dashboards).where(eq(dashboards.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function updateDashboard(id: number, config: DashboardConfig) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const dashboardsTable = dashboards;
  await db.update(dashboardsTable).set({ config, updatedAt: new Date() }).where(eq(dashboardsTable.id, id));
}

export async function deleteDashboard(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const dashboardsTable = dashboards;
  await db.delete(dashboardsTable).where(eq(dashboardsTable.id, id));
}
