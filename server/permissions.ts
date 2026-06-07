/**
 * نظام التحكم بالصلاحيات (RBAC)
 * يوفر دوال للتحقق من صلاحيات المستخدم
 */

import type { User } from '../drizzle/schema';

/**
 * الأدوار المتاحة في النظام
 */
export const ROLES = {
  ADMIN: 'admin',
  HR_MANAGER: 'hr_manager',
  DEPARTMENT_HEAD: 'department_head',
  USER: 'user',
} as const;

/**
 * الصلاحيات المتاحة في النظام
 */
export const PERMISSIONS = {
  // صلاحيات الموظفين
  EMPLOYEES_VIEW: 'employees:view',
  EMPLOYEES_CREATE: 'employees:create',
  EMPLOYEES_UPDATE: 'employees:update',
  EMPLOYEES_DELETE: 'employees:delete',
  EMPLOYEES_EXPORT: 'employees:export',

  // صلاحيات العقود
  CONTRACTS_VIEW: 'contracts:view',
  CONTRACTS_CREATE: 'contracts:create',
  CONTRACTS_UPDATE: 'contracts:update',
  CONTRACTS_DELETE: 'contracts:delete',

  // صلاحيات الوثائق
  DOCUMENTS_VIEW: 'documents:view',
  DOCUMENTS_CREATE: 'documents:create',
  DOCUMENTS_UPDATE: 'documents:update',
  DOCUMENTS_DELETE: 'documents:delete',

  // صلاحيات الموافقات
  APPROVALS_VIEW: 'approvals:view',
  APPROVALS_CREATE: 'approvals:create',
  APPROVALS_APPROVE: 'approvals:approve',
  APPROVALS_REJECT: 'approvals:reject',

  // صلاحيات الحضور
  ATTENDANCE_VIEW: 'attendance:view',
  ATTENDANCE_CREATE: 'attendance:create',
  ATTENDANCE_UPDATE: 'attendance:update',

  // صلاحيات سجل العمليات
  AUDIT_LOG_VIEW: 'audit_log:view',
  AUDIT_LOG_EXPORT: 'audit_log:export',

  // صلاحيات إدارة النظام
  SYSTEM_ADMIN: 'system:admin',
  USERS_MANAGE: 'users:manage',
  ROLES_MANAGE: 'roles:manage',
} as const;

/**
 * تعريف الصلاحيات لكل دور
 */
export const ROLE_PERMISSIONS: Record<string, string[]> = {
  [ROLES.ADMIN]: [
    // مدير النظام له جميع الصلاحيات
    PERMISSIONS.EMPLOYEES_VIEW,
    PERMISSIONS.EMPLOYEES_CREATE,
    PERMISSIONS.EMPLOYEES_UPDATE,
    PERMISSIONS.EMPLOYEES_DELETE,
    PERMISSIONS.EMPLOYEES_EXPORT,
    PERMISSIONS.CONTRACTS_VIEW,
    PERMISSIONS.CONTRACTS_CREATE,
    PERMISSIONS.CONTRACTS_UPDATE,
    PERMISSIONS.CONTRACTS_DELETE,
    PERMISSIONS.DOCUMENTS_VIEW,
    PERMISSIONS.DOCUMENTS_CREATE,
    PERMISSIONS.DOCUMENTS_UPDATE,
    PERMISSIONS.DOCUMENTS_DELETE,
    PERMISSIONS.APPROVALS_VIEW,
    PERMISSIONS.APPROVALS_CREATE,
    PERMISSIONS.APPROVALS_APPROVE,
    PERMISSIONS.APPROVALS_REJECT,
    PERMISSIONS.ATTENDANCE_VIEW,
    PERMISSIONS.ATTENDANCE_CREATE,
    PERMISSIONS.ATTENDANCE_UPDATE,
    PERMISSIONS.AUDIT_LOG_VIEW,
    PERMISSIONS.AUDIT_LOG_EXPORT,
    PERMISSIONS.SYSTEM_ADMIN,
    PERMISSIONS.USERS_MANAGE,
    PERMISSIONS.ROLES_MANAGE,
  ],

  [ROLES.HR_MANAGER]: [
    // مدير الموارد البشرية
    PERMISSIONS.EMPLOYEES_VIEW,
    PERMISSIONS.EMPLOYEES_CREATE,
    PERMISSIONS.EMPLOYEES_UPDATE,
    PERMISSIONS.EMPLOYEES_DELETE,
    PERMISSIONS.EMPLOYEES_EXPORT,
    PERMISSIONS.CONTRACTS_VIEW,
    PERMISSIONS.CONTRACTS_CREATE,
    PERMISSIONS.CONTRACTS_UPDATE,
    PERMISSIONS.CONTRACTS_DELETE,
    PERMISSIONS.DOCUMENTS_VIEW,
    PERMISSIONS.DOCUMENTS_CREATE,
    PERMISSIONS.DOCUMENTS_UPDATE,
    PERMISSIONS.DOCUMENTS_DELETE,
    PERMISSIONS.APPROVALS_VIEW,
    PERMISSIONS.APPROVALS_CREATE,
    PERMISSIONS.APPROVALS_APPROVE,
    PERMISSIONS.APPROVALS_REJECT,
    PERMISSIONS.ATTENDANCE_VIEW,
    PERMISSIONS.ATTENDANCE_CREATE,
    PERMISSIONS.ATTENDANCE_UPDATE,
    PERMISSIONS.AUDIT_LOG_VIEW,
  ],

  [ROLES.DEPARTMENT_HEAD]: [
    // رئيس القسم
    PERMISSIONS.EMPLOYEES_VIEW,
    PERMISSIONS.EMPLOYEES_UPDATE,
    PERMISSIONS.CONTRACTS_VIEW,
    PERMISSIONS.DOCUMENTS_VIEW,
    PERMISSIONS.DOCUMENTS_CREATE,
    PERMISSIONS.APPROVALS_VIEW,
    PERMISSIONS.APPROVALS_CREATE,
    PERMISSIONS.APPROVALS_APPROVE,
    PERMISSIONS.ATTENDANCE_VIEW,
  ],

  [ROLES.USER]: [
    // المستخدم العادي
    PERMISSIONS.EMPLOYEES_VIEW,
    PERMISSIONS.DOCUMENTS_VIEW,
    PERMISSIONS.APPROVALS_VIEW,
    PERMISSIONS.ATTENDANCE_VIEW,
  ],
};

/**
 * التحقق من وجود صلاحية معينة للمستخدم
 */
export function hasPermission(user: User, permission: string): boolean {
  if (!user) return false;

  const rolePermissions = ROLE_PERMISSIONS[user.role] || [];
  return rolePermissions.includes(permission);
}

/**
 * التحقق من وجود أي من الصلاحيات المعطاة
 */
export function hasAnyPermission(user: User, permissions: string[]): boolean {
  if (!user) return false;

  const rolePermissions = ROLE_PERMISSIONS[user.role] || [];
  return permissions.some(permission => rolePermissions.includes(permission));
}

/**
 * التحقق من وجود جميع الصلاحيات المعطاة
 */
export function hasAllPermissions(user: User, permissions: string[]): boolean {
  if (!user) return false;

  const rolePermissions = ROLE_PERMISSIONS[user.role] || [];
  return permissions.every(permission => rolePermissions.includes(permission));
}

/**
 * التحقق من أن المستخدم هو مدير نظام
 */
export function isAdmin(user: User): boolean {
  return user?.role === ROLES.ADMIN;
}

/**
 * التحقق من أن المستخدم هو مدير موارد بشرية
 */
export function isHRManager(user: User): boolean {
  return user?.role === ROLES.HR_MANAGER;
}

/**
 * التحقق من أن المستخدم هو رئيس قسم
 */
export function isDepartmentHead(user: User): boolean {
  return user?.role === ROLES.DEPARTMENT_HEAD;
}
