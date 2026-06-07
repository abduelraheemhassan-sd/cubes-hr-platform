import { trpc } from '@/lib/trpc';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Clock, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Approvals() {
  const { data: approvals = [], isLoading } = trpc.approvals.list.useQuery();
  const { data: employees = [] } = trpc.employees.list.useQuery();

  const getEmployeeName = (empId: number) => {
    const emp = employees.find((e: any) => e.id === empId);
    return emp ? `${emp.firstName} ${emp.lastName}` : '-';
  };

  const getApprovalType = (type: string) => {
    const types: Record<string, string> = {
      leave: 'إجازة',
      overtime: 'عمل إضافي',
      advance: 'سلفة',
      promotion: 'ترقية',
      transfer: 'نقل',
    };
    return types[type] || type;
  };

  const getApprovalStatus = (status: string) => {
    const statuses: Record<string, { label: string; color: string; icon: any }> = {
      pending: { label: 'قيد الانتظار', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
      approved: { label: 'موافق عليه', color: 'bg-green-100 text-green-800', icon: CheckCircle },
      rejected: { label: 'مرفوض', color: 'bg-red-100 text-red-800', icon: XCircle },
    };
    return statuses[status] || { label: status, color: 'bg-blue-100 text-blue-800', icon: Clock };
  };

  const pendingApprovals = approvals.filter((a: any) => a.status === 'pending').length;
  const approvedApprovals = approvals.filter((a: any) => a.status === 'approved').length;
  const rejectedApprovals = approvals.filter((a: any) => a.status === 'rejected').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">الموافقات</h1>
        <p className="text-gray-600 mt-1">إدارة الموافقات والقرارات المعلقة</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">قيد الانتظار</p>
                <p className="text-3xl font-bold text-yellow-600 mt-1">{pendingApprovals}</p>
              </div>
              <Clock className="w-12 h-12 text-yellow-100" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">موافق عليها</p>
                <p className="text-3xl font-bold text-green-600 mt-1">{approvedApprovals}</p>
              </div>
              <CheckCircle className="w-12 h-12 text-green-100" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">مرفوضة</p>
                <p className="text-3xl font-bold text-red-600 mt-1">{rejectedApprovals}</p>
              </div>
              <XCircle className="w-12 h-12 text-red-100" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Approvals Table */}
      <Card>
        <CardHeader>
          <CardTitle>قائمة الموافقات</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">الموظف</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">نوع الطلب</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">التاريخ</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">الحالة</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                      جاري التحميل...
                    </td>
                  </tr>
                ) : approvals.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                      لا توجد موافقات
                    </td>
                  </tr>
                ) : (
                  approvals.map((approval: any) => {
                    const statusInfo = getApprovalStatus(approval.status);
                    return (
                      <tr key={approval.id} className="border-t hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-900 font-medium">
                          {getEmployeeName(approval.employeeId)}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {getApprovalType(approval.type)}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {new Date(approval.createdAt).toLocaleDateString('ar-SA')}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
                            {statusInfo.label}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          {approval.status === 'pending' && (
                            <div className="flex gap-2">
                              <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                                موافقة
                              </Button>
                              <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white">
                                رفض
                              </Button>
                            </div>
                          )}
                          {approval.status !== 'pending' && (
                            <span className="text-gray-500 text-xs">تم الرد</span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
