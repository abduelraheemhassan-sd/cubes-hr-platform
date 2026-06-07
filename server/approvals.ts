import { getDb } from "./db";
import { approvals, approvalDetails } from "../drizzle/schema";
import { eq, and } from "drizzle-orm";
import { logAuditAction } from "./auditLog";

export type ApprovalRequestType = "leave" | "contract" | "document" | "employee_action" | "salary_change";
export type ApprovalPriority = "low" | "medium" | "high";
export type ApprovalStatus = "pending" | "approved" | "rejected";

export async function createApprovalRequest(
  requestType: ApprovalRequestType,
  requestedBy: number,
  description: string,
  priority: ApprovalPriority = "medium",
  dueDate?: Date,
  details?: Array<{ fieldName: string; oldValue?: string; newValue?: string }>
) {
  try {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    const result = await db.insert(approvals).values({
      requestType,
      requestedBy,
      description,
      priority,
      dueDate,
      status: "pending",
    });

    const approvalId = result[0].insertId;

    if (details && details.length > 0) {
      await db.insert(approvalDetails).values(
        details.map((detail) => ({
          approvalId: Number(approvalId),
          fieldName: detail.fieldName,
          oldValue: detail.oldValue,
          newValue: detail.newValue,
        }))
      );
    }

    await logAuditAction({
      userId: requestedBy,
      action: "CREATE_APPROVAL",
      module: "approvals",
      details: `تم إنشاء طلب موافقة جديد: ${requestType}`,
      newValues: {
        approvalId: Number(approvalId),
        requestType,
        priority,
      },
    });

    return Number(approvalId);
  } catch (error) {
    console.error("Error creating approval request:", error);
    throw error;
  }
}

export async function approveRequest(approvalId: number, approvedBy: number, notes?: string) {
  try {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    await db
      .update(approvals)
      .set({
        status: "approved",
        approvedBy,
        notes,
        updatedAt: new Date(),
      })
      .where(eq(approvals.id, approvalId));

    await logAuditAction({
      userId: approvedBy,
      action: "APPROVE_REQUEST",
      module: "approvals",
      targetId: approvalId,
      details: `تم الموافقة على طلب الموافقة رقم ${approvalId}`,
      newValues: {
        approvalId,
        status: "approved",
      },
    });

    return true;
  } catch (error) {
    console.error("Error approving request:", error);
    throw error;
  }
}

export async function rejectRequest(
  approvalId: number,
  rejectedBy: number,
  rejectionReason: string,
  notes?: string
) {
  try {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    await db
      .update(approvals)
      .set({
        status: "rejected",
        approvedBy: rejectedBy,
        rejectionReason,
        notes,
        updatedAt: new Date(),
      })
      .where(eq(approvals.id, approvalId));

    await logAuditAction({
      userId: rejectedBy,
      action: "REJECT_REQUEST",
      module: "approvals",
      targetId: approvalId,
      details: `تم رفض طلب الموافقة رقم ${approvalId}`,
      newValues: {
        approvalId,
        status: "rejected",
        reason: rejectionReason,
      },
    });

    return true;
  } catch (error) {
    console.error("Error rejecting request:", error);
    throw error;
  }
}

export async function getAllApprovals(filters?: {
  status?: ApprovalStatus;
  requestType?: ApprovalRequestType;
  requestedBy?: number;
  approvedBy?: number;
}) {
  try {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    const conditions = [];
    if (filters?.status) conditions.push(eq(approvals.status, filters.status));
    if (filters?.requestType) conditions.push(eq(approvals.requestType, filters.requestType));
    if (filters?.requestedBy) conditions.push(eq(approvals.requestedBy, filters.requestedBy));
    if (filters?.approvedBy) conditions.push(eq(approvals.approvedBy, filters.approvedBy));

    if (conditions.length > 0) {
      return await db.select().from(approvals).where(and(...conditions));
    }

    return await db.select().from(approvals);
  } catch (error) {
    console.error("Error fetching approvals:", error);
    throw error;
  }
}

export async function getApprovalById(approvalId: number) {
  try {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    const approval = await db.select().from(approvals).where(eq(approvals.id, approvalId));

    if (approval.length === 0) {
      return null;
    }

    const details = await db.select().from(approvalDetails).where(eq(approvalDetails.approvalId, approvalId));

    return {
      ...approval[0],
      details,
    };
  } catch (error) {
    console.error("Error fetching approval:", error);
    throw error;
  }
}

export async function getPendingApprovals() {
  try {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    return await db.select().from(approvals).where(eq(approvals.status, "pending"));
  } catch (error) {
    console.error("Error fetching pending approvals:", error);
    throw error;
  }
}

export async function getUserPendingApprovals(userId: number) {
  try {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    return await db
      .select()
      .from(approvals)
      .where(and(eq(approvals.status, "pending"), eq(approvals.requestedBy, userId)));
  } catch (error) {
    console.error("Error fetching user pending approvals:", error);
    throw error;
  }
}
