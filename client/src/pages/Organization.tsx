import { trpc } from '@/lib/trpc';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, Users } from 'lucide-react';

export default function Organization() {
  const { data: departments = [], isLoading } = trpc.departments.list.useQuery();
  const { data: employees = [] } = trpc.employees.list.useQuery();

  const getDepartmentEmployeeCount = (deptId: number) => {
    return employees.filter((emp: any) => emp.departmentId === deptId).length;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">الهيكل التنظيمي</h1>
        <p className="text-gray-600 mt-1">عرض الأقسام والهيكل التنظيمي للمنظمة</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">إجمالي الأقسام</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{departments.length}</p>
              </div>
              <Building2 className="w-12 h-12 text-indigo-100" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">إجمالي الموظفين</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{employees.length}</p>
              </div>
              <Users className="w-12 h-12 text-green-100" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Departments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <div className="col-span-full text-center py-8 text-gray-500">
            جاري التحميل...
          </div>
        ) : departments.length === 0 ? (
          <div className="col-span-full text-center py-8 text-gray-500">
            لا توجد أقسام
          </div>
        ) : (
          departments.map((dept: any) => (
            <Card key={dept.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg">{dept.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600">الوصف</p>
                  <p className="text-gray-900 mt-1">{dept.description || '-'}</p>
                </div>
                <div className="flex items-center gap-2 pt-4 border-t">
                  <Users className="w-4 h-4 text-indigo-600" />
                  <span className="text-sm text-gray-600">
                    {getDepartmentEmployeeCount(dept.id)} موظف
                  </span>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Department Details */}
      {!isLoading && departments.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>تفاصيل الأقسام</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">اسم القسم</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">عدد الموظفين</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">الوصف</th>
                  </tr>
                </thead>
                <tbody>
                  {departments.map((dept: any) => (
                    <tr key={dept.id} className="border-t hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-900 font-medium">{dept.name}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 text-indigo-800 text-xs font-medium">
                          {getDepartmentEmployeeCount(dept.id)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">{dept.description || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
