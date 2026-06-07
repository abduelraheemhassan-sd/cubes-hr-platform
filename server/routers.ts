import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";
import { logActivity } from "./db";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // Employees router
  employees: router({
    list: protectedProcedure.query(async () => {
      return await db.getEmployees();
    }),
    getById: protectedProcedure.input(z.object({ id: z.number() })).query(async ({ input }) => {
      return await db.getEmployeeById(input.id);
    }),
    create: protectedProcedure.input(z.object({
      firstName: z.string(),
      lastName: z.string(),
      email: z.string().email(),
      phone: z.string().optional(),
      nationalId: z.string().optional(),
      departmentId: z.number().optional(),
      position: z.string().optional(),
      salary: z.string().optional(),
      hireDate: z.string().optional(),
    })).mutation(async ({ input, ctx }) => {
      const result = await db.createEmployee(input as any);
      await logActivity(ctx.user?.id, "CREATE", "employees", undefined, "employee", `Created employee: ${input.firstName} ${input.lastName}`);
      return result;
    }),
    update: protectedProcedure.input(z.object({
      id: z.number(),
      firstName: z.string().optional(),
      lastName: z.string().optional(),
      email: z.string().email().optional(),
      phone: z.string().optional(),
      departmentId: z.number().optional(),
      position: z.string().optional(),
      status: z.enum(["active", "inactive", "on_leave", "terminated"]).optional(),
    })).mutation(async ({ input, ctx }) => {
      const { id, ...data } = input;
      const result = await db.updateEmployee(id, data as any);
      await logActivity(ctx.user?.id, "UPDATE", "employees", id, "employee", "Updated employee");
      return result;
    }),
    delete: protectedProcedure.input(z.object({ id: z.number() })).mutation(async ({ input, ctx }) => {
      const result = await db.deleteEmployee(input.id);
      await logActivity(ctx.user?.id, "DELETE", "employees", input.id, "employee", "Deleted employee");
      return result;
    }),
  }),

  // Departments router
  departments: router({
    list: protectedProcedure.query(async () => {
      return await db.getDepartments();
    }),
    getById: protectedProcedure.input(z.object({ id: z.number() })).query(async ({ input }) => {
      return await db.getDepartmentById(input.id);
    }),
  }),

  // Contracts router
  contracts: router({
    list: protectedProcedure.query(async () => {
      return await db.getContracts();
    }),
    getByEmployeeId: protectedProcedure.input(z.object({ employeeId: z.number() })).query(async ({ input }) => {
      return await db.getContractsByEmployeeId(input.employeeId);
    }),
  }),

  // Documents router
  documents: router({
    list: protectedProcedure.query(async () => {
      return await db.getDocuments();
    }),
  }),

  // Approvals router
  approvals: router({
    list: protectedProcedure.query(async () => {
      return await db.getApprovals();
    }),
    pending: protectedProcedure.query(async () => {
      return await db.getPendingApprovals();
    }),
  }),

  // Attendance router
  attendance: router({
    getByEmployeeId: protectedProcedure.input(z.object({ employeeId: z.number() })).query(async ({ input }) => {
      return await db.getAttendanceByEmployeeId(input.employeeId);
    }),
  }),

  // Notifications router
  notifications: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      if (!ctx.user?.id) return [];
      return await db.getUserNotifications(ctx.user.id);
    }),
    unread: protectedProcedure.query(async ({ ctx }) => {
      if (!ctx.user?.id) return [];
      return await db.getUnreadNotifications(ctx.user.id);
    }),
  }),
});

export type AppRouter = typeof appRouter;
