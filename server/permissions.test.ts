import { describe, it, expect } from 'vitest';
import {
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,
  isAdmin,
  isHRManager,
  isDepartmentHead,
  PERMISSIONS,
  ROLES,
  ROLE_PERMISSIONS,
} from './permissions';
import type { User } from '../drizzle/schema';

describe('Permissions System', () => {
  const adminUser: User = {
    id: 1,
    openId: 'admin-1',
    name: 'Admin User',
    email: 'admin@test.com',
    loginMethod: 'google',
    role: ROLES.ADMIN,
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const hrManagerUser: User = {
    id: 2,
    openId: 'hr-1',
    name: 'HR Manager',
    email: 'hr@test.com',
    loginMethod: 'google',
    role: ROLES.HR_MANAGER,
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const departmentHeadUser: User = {
    id: 3,
    openId: 'dept-1',
    name: 'Department Head',
    email: 'dept@test.com',
    loginMethod: 'google',
    role: ROLES.DEPARTMENT_HEAD,
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const regularUser: User = {
    id: 4,
    openId: 'user-1',
    name: 'Regular User',
    email: 'user@test.com',
    loginMethod: 'google',
    role: ROLES.USER,
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  describe('hasPermission', () => {
    it('should return true if admin has permission', () => {
      expect(hasPermission(adminUser, PERMISSIONS.EMPLOYEES_VIEW)).toBe(true);
      expect(hasPermission(adminUser, PERMISSIONS.SYSTEM_ADMIN)).toBe(true);
    });

    it('should return true if HR manager has permission', () => {
      expect(hasPermission(hrManagerUser, PERMISSIONS.EMPLOYEES_CREATE)).toBe(true);
      expect(hasPermission(hrManagerUser, PERMISSIONS.CONTRACTS_UPDATE)).toBe(true);
    });

    it('should return false if user does not have permission', () => {
      expect(hasPermission(regularUser, PERMISSIONS.EMPLOYEES_CREATE)).toBe(false);
      expect(hasPermission(regularUser, PERMISSIONS.SYSTEM_ADMIN)).toBe(false);
    });

    it('should return false if user is null', () => {
      expect(hasPermission(null as any, PERMISSIONS.EMPLOYEES_VIEW)).toBe(false);
    });
  });

  describe('hasAnyPermission', () => {
    it('should return true if user has at least one permission', () => {
      expect(
        hasAnyPermission(hrManagerUser, [
          PERMISSIONS.EMPLOYEES_DELETE,
          PERMISSIONS.CONTRACTS_CREATE,
        ])
      ).toBe(true);
    });

    it('should return false if user has none of the permissions', () => {
      expect(
        hasAnyPermission(regularUser, [
          PERMISSIONS.EMPLOYEES_DELETE,
          PERMISSIONS.SYSTEM_ADMIN,
        ])
      ).toBe(false);
    });
  });

  describe('hasAllPermissions', () => {
    it('should return true if user has all permissions', () => {
      expect(
        hasAllPermissions(adminUser, [
          PERMISSIONS.EMPLOYEES_VIEW,
          PERMISSIONS.CONTRACTS_CREATE,
          PERMISSIONS.SYSTEM_ADMIN,
        ])
      ).toBe(true);
    });

    it('should return false if user does not have all permissions', () => {
      expect(
        hasAllPermissions(hrManagerUser, [
          PERMISSIONS.EMPLOYEES_VIEW,
          PERMISSIONS.SYSTEM_ADMIN,
        ])
      ).toBe(false);
    });
  });

  describe('Role checks', () => {
    it('should correctly identify admin', () => {
      expect(isAdmin(adminUser)).toBe(true);
      expect(isAdmin(hrManagerUser)).toBe(false);
      expect(isAdmin(regularUser)).toBe(false);
    });

    it('should correctly identify HR manager', () => {
      expect(isHRManager(hrManagerUser)).toBe(true);
      expect(isHRManager(adminUser)).toBe(false);
      expect(isHRManager(regularUser)).toBe(false);
    });

    it('should correctly identify department head', () => {
      expect(isDepartmentHead(departmentHeadUser)).toBe(true);
      expect(isDepartmentHead(adminUser)).toBe(false);
      expect(isDepartmentHead(regularUser)).toBe(false);
    });
  });

  describe('Role permissions mapping', () => {
    it('should have permissions for all roles', () => {
      expect(ROLE_PERMISSIONS[ROLES.ADMIN]).toBeDefined();
      expect(ROLE_PERMISSIONS[ROLES.HR_MANAGER]).toBeDefined();
      expect(ROLE_PERMISSIONS[ROLES.DEPARTMENT_HEAD]).toBeDefined();
      expect(ROLE_PERMISSIONS[ROLES.USER]).toBeDefined();
    });

    it('admin should have more permissions than other roles', () => {
      const adminPerms = ROLE_PERMISSIONS[ROLES.ADMIN].length;
      const hrPerms = ROLE_PERMISSIONS[ROLES.HR_MANAGER].length;
      const deptPerms = ROLE_PERMISSIONS[ROLES.DEPARTMENT_HEAD].length;
      const userPerms = ROLE_PERMISSIONS[ROLES.USER].length;

      expect(adminPerms).toBeGreaterThan(hrPerms);
      expect(hrPerms).toBeGreaterThan(deptPerms);
      expect(deptPerms).toBeGreaterThan(userPerms);
    });

    it('should have system admin permission only for admin', () => {
      expect(ROLE_PERMISSIONS[ROLES.ADMIN]).toContain(PERMISSIONS.SYSTEM_ADMIN);
      expect(ROLE_PERMISSIONS[ROLES.HR_MANAGER]).not.toContain(PERMISSIONS.SYSTEM_ADMIN);
      expect(ROLE_PERMISSIONS[ROLES.DEPARTMENT_HEAD]).not.toContain(PERMISSIONS.SYSTEM_ADMIN);
      expect(ROLE_PERMISSIONS[ROLES.USER]).not.toContain(PERMISSIONS.SYSTEM_ADMIN);
    });
  });
});
