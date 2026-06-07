import { trpc } from '@/lib/trpc';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Calendar, CheckCircle } from 'lucide-react';

export default function Contracts() {
  const { data: contracts = [], isLoading } = trpc.contracts.list.useQuery();
  const { data: employees = [] } = trpc.employees.list.useQuery();

  const getEmployeeName = (empId: number) => {
    const emp = employees.find((e: any) => e.id === empId);
    return emp ? `${emp.firstName} ${emp.lastName}` : '-';
  };

  const getContractStatus = (status: string) => {
    const statuses: Record<string, { label: string; color: string }> = {
      active: { label: 'نشط', color: 'bg-green-100 text-green-800' },
      expired: { label: 'منتهي', color: 'bg-red-100 text-red-800' },
      terminated: { label: 'ملغى', color: 'bg-gray-100 text-gray-800' },
    };
    return statuses[status] || { label: status, color: 'bg-blue-100 text-blue-800' };
  };

  const getContractType = (type: string) => {
    const types: Record<string, string> = {
      permanent: 'عقد دائم',
      contract: 'عقد محدد المدة',
      temporary: 'عقد مؤقت',
      probation: 'فترة تجربة',
    };
    return types[type] || type;
  };

  const activeContracts = contracts.filter((c: any) => c.status === 'active').length;
  const expiredContracts = contracts.filter((c: any) => c.status === 'expired').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">العقود</h1>
        <p className="text-gray-600 mt-1">إدارة عقود العمل والتوظيف</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">إجمالي العقود</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{contracts.length}</p>
              </div>
              <FileText className="w-12 h-12 text-indigo-100" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">عقود نشطة</p>
                <p className="text-3xl font-bold text-green-600 mt-1">{activeContracts}</p>
              </div>
              <CheckCircle className="w-12 h-12 text-green-100" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">عقود منتهية</p>
                <p className="text-3xl font-bold text-red-600 mt-1">{expiredContracts}</p>
              </div>
              <Calendar className="w-12 h-12 text-red-100" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Contracts Table */}
      <Card>
        <CardHeader>
          <CardTitle>قائمة العقود</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">الموظف</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">نوع العقد</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">تاريخ البداية</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">تاريخ النهاية</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">الحالة</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                      جاري التحميل...
                    </td>
                  </tr>
                ) : contracts.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                      لا توجد عقود
                    </td>
                  </tr>
                ) : (
                  contracts.map((contract: any) => {
                    const statusInfo = getContractStatus(contract.status);
                    return (
                      <tr key={contract.id} className="border-t hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-900 font-medium">
                          {getEmployeeName(contract.employeeId)}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {getContractType(contract.contractType)}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {new Date(contract.startDate).toLocaleDateString('ar-SA')}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {contract.endDate ? new Date(contract.endDate).toLocaleDateString('ar-SA') : '-'}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
                            {statusInfo.label}
                          </span>
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
