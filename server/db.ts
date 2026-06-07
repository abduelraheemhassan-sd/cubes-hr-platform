import { eq, and } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, employees, InsertEmployee, departments, roles, permissions, rolePermissions, contracts, documents, approvals, attendance, notifications, activityLog, employeeDocuments, InsertEmployeeDocument, EmployeeDocument } from "../drizzle/schema";
import { ENV } from './_core/env';

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

// ===== Employee queries =====
export async function getEmployees() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(employees);
}

export async function getEmployeeById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(employees).where(eq(employees.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createEmployee(employee: InsertEmployee) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(employees).values(employee);
  return result;
}

export async function updateEmployee(id: number, data: Partial<InsertEmployee>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.update(employees).set(data).where(eq(employees.id, id));
}

export async function deleteEmployee(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.delete(employees).where(eq(employees.id, id));
}

// ===== Department queries =====
export async function getDepartments() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(departments);
}

export async function getDepartmentById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(departments).where(eq(departments.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// ===== Contract queries =====
export async function getContracts() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(contracts);
}

export async function getContractsByEmployeeId(employeeId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(contracts).where(eq(contracts.employeeId, employeeId));
}

// ===== Document queries =====
export async function getDocuments() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(documents);
}

// ===== Approval queries =====
export async function getApprovals() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(approvals);
}

export async function getPendingApprovals() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(approvals).where(eq(approvals.status, "pending"));
}

// ===== Attendance queries =====
export async function getAttendanceByEmployeeId(employeeId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(attendance).where(eq(attendance.employeeId, employeeId));
}

export async function getAttendanceByDate(date: Date) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(attendance).where(eq(attendance.date, date));
}

// ===== Notification queries =====
export async function getUserNotifications(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(notifications).where(eq(notifications.userId, userId));
}

export async function getUnreadNotifications(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(notifications).where(
    and(eq(notifications.userId, userId), eq(notifications.isRead, false))
  );
}

// ===== Activity Log queries =====
export async function logActivity(userId: number | undefined, action: string, module: string, targetId?: number, targetType?: string, details?: string) {
  const db = await getDb();
  if (!db) return;
  
  return await db.insert(activityLog).values({
    userId,
    action,
    module,
    targetId,
    targetType,
    details,
  });
}

// ===== Role & Permission queries =====
export async function getRolePermissions(roleId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(rolePermissions).where(eq(rolePermissions.roleId, roleId));
}

export async function checkUserPermission(userId: number, module: string, action: string): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;

  const user = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  if (user.length === 0) return false;

  // Admin users have all permissions
  if (user[0].role === 'admin') return true;

  // Check role-based permissions
  const userRole = user[0].role;
  const roleRecord = await db.select().from(roles).where(eq(roles.name, userRole)).limit(1);
  
  if (roleRecord.length === 0) return false;

  const perms = await db.select().from(rolePermissions).where(eq(rolePermissions.roleId, roleRecord[0].id));
  const permIds = perms.map(p => p.permissionId);

  if (permIds.length === 0) return false;

  const perm = await db.select().from(permissions).where(
    and(
      eq(permissions.module, module),
      eq(permissions.action, action)
    )
  ).limit(1);

  return perm.length > 0 && permIds.includes(perm[0].id);
}


// ===== Employee Documents queries =====
export async function getEmployeeDocuments(employeeId: number): Promise<EmployeeDocument[]> {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(employeeDocuments).where(eq(employeeDocuments.employeeId, employeeId));
}

export async function createEmployeeDocument(data: InsertEmployeeDocument) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(employeeDocuments).values(data);
  return result;
}

export async function updateEmployeeDocument(id: number, data: Partial<InsertEmployeeDocument>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db.update(employeeDocuments).set(data).where(eq(employeeDocuments.id, id));
}

export async function deleteEmployeeDocument(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db.delete(employeeDocuments).where(eq(employeeDocuments.id, id));
}

export async function getEmployeeDocumentById(id: number): Promise<EmployeeDocument | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(employeeDocuments).where(eq(employeeDocuments.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}
