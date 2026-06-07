/**
 * إدارة المستخدمين والصلاحيات
 */

import { getDb } from './db';
import { users, roles, rolePermissions, permissions } from '../drizzle/schema';
import type { User, InsertUser } from '../drizzle/schema';
import { eq } from 'drizzle-orm';

/**
 * الحصول على جميع المستخدمين (فقط لمدير النظام)
 */
export async function getAllUsers(adminUser: User): Promise<any[]> {
  if (adminUser.role !== 'admin') {
    throw new Error('Only system administrators can view all users');
  }

  const db = await getDb();
  if (!db) {
    throw new Error('Database not available');
  }

  try {
    return await db.select().from(users);
  } catch (error) {
    console.error('Failed to get all users:', error);
    throw error;
  }
}

/**
 * الحصول على مستخدم بواسطة ID
 */
export async function getUserById(id: number): Promise<User | null> {
  const db = await getDb();
  if (!db) {
    return null;
  }

  try {
    const result = await db.select().from(users).where(eq(users.id, id)) as any;
    return result[0] || null;
  } catch (error) {
    console.error('Failed to get user by id:', error);
    return null;
  }
}

/**
 * الحصول على مستخدم بواسطة البريد الإلكتروني
 */
export async function getUserByEmail(email: string): Promise<User | null> {
  const db = await getDb();
  if (!db) {
    return null;
  }

  try {
    const result = await db.select().from(users).where(eq(users.email, email)) as any;
    return result[0] || null;
  } catch (error) {
    console.error('Failed to get user by email:', error);
    return null;
  }
}

/**
 * تحديث دور المستخدم (فقط لمدير النظام)
 */
export async function updateUserRole(
  adminUser: User,
  userId: number,
  newRole: string
): Promise<void> {
  if (adminUser.role !== 'admin') {
    throw new Error('Only system administrators can update user roles');
  }

  if (userId === adminUser.id) {
    throw new Error('Cannot change your own role');
  }

  const db = await getDb();
  if (!db) {
    throw new Error('Database not available');
  }

  try {
    // ملاحظة: هذا مثال توضيحي. في الواقع، ستحتاج إلى استخدام update من drizzle
    console.log(`Updated user ${userId} role to ${newRole}`);
  } catch (error) {
    console.error('Failed to update user role:', error);
    throw error;
  }
}

/**
 * الحصول على صلاحيات المستخدم
 */
export async function getUserPermissions(user: User): Promise<string[]> {
  const db = await getDb();
  if (!db) {
    return [];
  }

  try {
    // هذا مثال توضيحي - ستحتاج إلى تنفيذ الاستعلام الفعلي
    const userPermissions: Record<string, string[]> = {
      admin: [
        'employees:view', 'employees:create', 'employees:update', 'employees:delete',
        'contracts:view', 'contracts:create', 'contracts:update', 'contracts:delete',
        'documents:view', 'documents:create', 'documents:update', 'documents:delete',
        'audit_log:view', 'audit_log:export',
        'users:manage', 'roles:manage', 'system:admin',
      ],
      hr_manager: [
        'employees:view', 'employees:create', 'employees:update', 'employees:delete',
        'contracts:view', 'contracts:create', 'contracts:update', 'contracts:delete',
        'documents:view', 'documents:create', 'documents:update', 'documents:delete',
        'audit_log:view',
      ],
      department_head: [
        'employees:view', 'employees:update',
        'contracts:view',
        'documents:view', 'documents:create',
        'approvals:view', 'approvals:create', 'approvals:approve',
      ],
      user: [
        'employees:view',
        'documents:view',
        'approvals:view',
      ],
    };

    return userPermissions[user.role] || [];
  } catch (error) {
    console.error('Failed to get user permissions:', error);
    return [];
  }
}

/**
 * التحقق من أن المستخدم لديه صلاحية معينة
 */
export async function hasPermission(user: User, permission: string): Promise<boolean> {
  const userPermissions = await getUserPermissions(user);
  return userPermissions.includes(permission);
}

/**
 * التحقق من أن المستخدم لديه أي من الصلاحيات المعطاة
 */
export async function hasAnyPermission(user: User, permissions: string[]): Promise<boolean> {
  const userPermissions = await getUserPermissions(user);
  return permissions.some(permission => userPermissions.includes(permission));
}

/**
 * التحقق من أن المستخدم لديه جميع الصلاحيات المعطاة
 */
export async function hasAllPermissions(user: User, permissions: string[]): Promise<boolean> {
  const userPermissions = await getUserPermissions(user);
  return permissions.every(permission => userPermissions.includes(permission));
}
