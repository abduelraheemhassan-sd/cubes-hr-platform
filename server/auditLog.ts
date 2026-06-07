/**
 * نظام تسجيل العمليات (Audit Log)
 * يسجل جميع العمليات في النظام ولا يمكن تعديل السجل إلا من قبل مدير النظام
 */

import { getDb } from './db';
import { auditLog } from '../drizzle/schema';
import type { User } from '../drizzle/schema';

export interface AuditLogEntry {
  userId: number;
  action: string;
  module: string;
  targetId?: number;
  targetType?: string;
  oldValues?: Record<string, any>;
  newValues?: Record<string, any>;
  details?: string;
  ipAddress?: string;
  userAgent?: string;
  status?: 'success' | 'failure';
}

/**
 * تسجيل عملية في سجل العمليات
 */
export async function logAuditAction(entry: AuditLogEntry): Promise<void> {
  try {
    const db = await getDb();
    if (!db) {
      console.warn('[Audit Log] Database not available');
      return;
    }
    await db.insert(auditLog).values({
      userId: entry.userId,
      action: entry.action,
      module: entry.module,
      targetId: entry.targetId,
      targetType: entry.targetType,
      oldValues: entry.oldValues ? JSON.stringify(entry.oldValues) : null,
      newValues: entry.newValues ? JSON.stringify(entry.newValues) : null,
      details: entry.details,
      ipAddress: entry.ipAddress,
      userAgent: entry.userAgent,
      status: entry.status || 'success',
    });
  } catch (error) {
    console.error('Failed to log audit action:', error);
    // لا نرفع الخطأ لأننا لا نريد أن يؤثر فشل التسجيل على العملية الأساسية
  }
}

/**
 * تسجيل عملية إنشاء
 */
export async function logCreate(
  user: User,
  module: string,
  targetId: number,
  targetType: string,
  newValues: Record<string, any>,
  ipAddress?: string,
  userAgent?: string
): Promise<void> {
  await logAuditAction({
    userId: user.id,
    action: 'create',
    module,
    targetId,
    targetType,
    newValues,
    ipAddress,
    userAgent,
  });
}

/**
 * تسجيل عملية تحديث
 */
export async function logUpdate(
  user: User,
  module: string,
  targetId: number,
  targetType: string,
  oldValues: Record<string, any>,
  newValues: Record<string, any>,
  ipAddress?: string,
  userAgent?: string
): Promise<void> {
  await logAuditAction({
    userId: user.id,
    action: 'update',
    module,
    targetId,
    targetType,
    oldValues,
    newValues,
    ipAddress,
    userAgent,
  });
}

/**
 * تسجيل عملية حذف
 */
export async function logDelete(
  user: User,
  module: string,
  targetId: number,
  targetType: string,
  oldValues: Record<string, any>,
  ipAddress?: string,
  userAgent?: string
): Promise<void> {
  await logAuditAction({
    userId: user.id,
    action: 'delete',
    module,
    targetId,
    targetType,
    oldValues,
    ipAddress,
    userAgent,
  });
}

/**
 * تسجيل عملية تسجيل دخول
 */
export async function logLogin(
  user: User,
  ipAddress?: string,
  userAgent?: string
): Promise<void> {
  await logAuditAction({
    userId: user.id,
    action: 'login',
    module: 'auth',
    details: `User ${user.email} logged in`,
    ipAddress,
    userAgent,
  });
}

/**
 * تسجيل عملية تسجيل خروج
 */
export async function logLogout(
  user: User,
  ipAddress?: string,
  userAgent?: string
): Promise<void> {
  await logAuditAction({
    userId: user.id,
    action: 'logout',
    module: 'auth',
    details: `User ${user.email} logged out`,
    ipAddress,
    userAgent,
  });
}

/**
 * تسجيل عملية فشلت
 */
export async function logFailedAction(
  userId: number,
  action: string,
  module: string,
  error: string,
  ipAddress?: string,
  userAgent?: string
): Promise<void> {
  await logAuditAction({
    userId,
    action,
    module,
    details: error,
    ipAddress,
    userAgent,
    status: 'failure',
  });
}

/**
 * الحصول على سجل العمليات (فقط لمدير النظام)
 */
export async function getAuditLog(
  user: User,
  filters?: {
    module?: string;
    action?: string;
    userId?: number;
    targetType?: string;
    startDate?: Date;
    endDate?: Date;
    limit?: number;
    offset?: number;
  }
): Promise<any[]> {
  // التحقق من أن المستخدم هو مدير نظام
  if (user.role !== 'admin') {
    throw new Error('Only system administrators can view audit logs');
  }

  try {
    const db = await getDb();
    if (!db) {
      throw new Error('Database not available');
    }
    let query: any = db.select().from(auditLog);

    if (filters?.module) {
      query = query.where((col: any) => col.module === filters.module);
    }

    if (filters?.action) {
      query = query.where((col: any) => col.action === filters.action);
    }

    if (filters?.userId) {
      query = query.where((col: any) => col.userId === filters.userId);
    }

    if (filters?.targetType) {
      query = query.where((col: any) => col.targetType === filters.targetType);
    }

    // ملاحظة: التاريخ يتطلب مقارنة يدوية
    const result = await query;

    let filtered = result;

    if (filters?.startDate) {
      filtered = filtered.filter(
        (log: any) => new Date(log.createdAt) >= filters.startDate!
      );
    }

    if (filters?.endDate) {
      filtered = filtered.filter(
        (log: any) => new Date(log.createdAt) <= filters.endDate!
      );
    }

    const offset = filters?.offset || 0;
    const limit = filters?.limit || 100;

    return filtered
      .sort(
        (a: any, b: any) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      .slice(offset, offset + limit);
  } catch (error) {
    console.error('Failed to get audit log:', error);
    throw error;
  }
}

/**
 * حذف سجل العمليات (فقط لمدير النظام ولا يمكن حذف السجل الفعلي)
 * هذه الدالة موجودة للتوثيق فقط - السجل لا يمكن حذفه
 */
export function cannotDeleteAuditLog(): Error {
  return new Error('Audit logs cannot be deleted. They are immutable records.');
}
