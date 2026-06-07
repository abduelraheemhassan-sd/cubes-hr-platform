import { trpc } from '@/lib/trpc';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Upload, Download, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Documents() {
  const { data: documents = [], isLoading } = trpc.documents.list.useQuery();
  const { data: employees = [] } = trpc.employees.list.useQuery();

  const getEmployeeName = (empId: number) => {
    const emp = employees.find((e: any) => e.id === empId);
    return emp ? `${emp.firstName} ${emp.lastName}` : '-';
  };

  const getDocumentType = (type: string) => {
    const types: Record<string, string> = {
      cv: 'السيرة الذاتية',
      certificate: 'الشهادات',
      contract: 'العقد',
      id: 'الهوية',
      other: 'أخرى',
    };
    return types[type] || type;
  };

  const getDocumentStatus = (status: string) => {
    const statuses: Record<string, { label: string; color: string }> = {
      active: { label: 'نشط', color: 'bg-green-100 text-green-800' },
      expired: { label: 'منتهي الصلاحية', color: 'bg-red-100 text-red-800' },
      archived: { label: 'مؤرشف', color: 'bg-gray-100 text-gray-800' },
    };
    return statuses[status] || { label: status, color: 'bg-blue-100 text-blue-800' };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">الوثائق</h1>
          <p className="text-gray-600 mt-1">إدارة الوثائق والملفات الشخصية للموظفين</p>
        </div>
        <Button className="bg-indigo-600 hover:bg-indigo-700">
          <Upload className="w-4 h-4 ml-2" />
          رفع وثيقة
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">إجمالي الوثائق</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{documents.length}</p>
              </div>
              <FileText className="w-12 h-12 text-indigo-100" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">وثائق نشطة</p>
                <p className="text-3xl font-bold text-green-600 mt-1">
                  {documents.filter((d: any) => d.status === 'active').length}
                </p>
              </div>
              <FileText className="w-12 h-12 text-green-100" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">وثائق منتهية الصلاحية</p>
                <p className="text-3xl font-bold text-red-600 mt-1">
                  {documents.filter((d: any) => d.status === 'expired').length}
                </p>
              </div>
              <FileText className="w-12 h-12 text-red-100" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Documents Table */}
      <Card>
        <CardHeader>
          <CardTitle>قائمة الوثائق</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">الموظف</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">نوع الوثيقة</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">تاريخ الإصدار</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">تاريخ الانتهاء</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">الحالة</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                      جاري التحميل...
                    </td>
                  </tr>
                ) : documents.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                      لا توجد وثائق
                    </td>
                  </tr>
                ) : (
                  documents.map((doc: any) => {
                    const statusInfo = getDocumentStatus(doc.status);
                    return (
                      <tr key={doc.id} className="border-t hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-900 font-medium">
                          {getEmployeeName(doc.employeeId)}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {getDocumentType(doc.type)}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {new Date(doc.issueDate).toLocaleDateString('ar-SA')}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {doc.expiryDate ? new Date(doc.expiryDate).toLocaleDateString('ar-SA') : '-'}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
                            {statusInfo.label}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <div className="flex gap-2">
                            <button className="text-indigo-600 hover:text-indigo-700">
                              <Download className="w-4 h-4" />
                            </button>
                            <button className="text-red-600 hover:text-red-700">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
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
