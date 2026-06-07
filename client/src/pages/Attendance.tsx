import { trpc } from '@/lib/trpc';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Attendance() {
  const { data: attendance = [], isLoading } = trpc.attendance.getByEmployeeId.useQuery({ employeeId: 0 });
  const { data: employees = [] } = trpc.employees.list.useQuery();

  const getEmployeeName = (empId: number) => {
    const emp = employees.find((e: any) => e.id === empId);
    return emp ? `${emp.firstName} ${emp.lastName}` : '-';
  };

  const getAttendanceStatus = (status: string) => {
    const statuses: Record<string, { label: string; color: string; icon: any }> = {
      present: { label: 'حاضر', color: 'bg-green-100 text-green-800', icon: CheckCircle },
      absent: { label: 'غائب', color: 'bg-red-100 text-red-800', icon: AlertCircle },
      late: { label: 'متأخر', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
      leave: { label: 'إجازة', color: 'bg-blue-100 text-blue-800', icon: Clock },
    };
    return statuses[status] || { label: status, color: 'bg-gray-100 text-gray-800', icon: Users };
  };

  const today = new Date().toISOString().split('T')[0];
  const todayAttendance = attendance.filter((a: any) => a.date === today);
  
  const presentCount = todayAttendance.filter((a: any) => a.status === 'present').length;
  const absentCount = todayAttendance.filter((a: any) => a.status === 'absent').length;
  const lateCount = todayAttendance.filter((a: any) => a.status === 'late').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">الحضور والانصراف</h1>
          <p className="text-gray-600 mt-1">تسجيل الحضور اليومي وتتبع الاستثناءات</p>
        </div>
        <Button className="bg-indigo-600 hover:bg-indigo-700">
          تسجيل الحضور
        </Button>
      </div>

      {/* Today's Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">إجمالي الموظفين</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{employees.length}</p>
              </div>
              <Users className="w-12 h-12 text-indigo-100" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">حاضرون اليوم</p>
                <p className="text-3xl font-bold text-green-600 mt-1">{presentCount}</p>
              </div>
              <CheckCircle className="w-12 h-12 text-green-100" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">غائبون اليوم</p>
                <p className="text-3xl font-bold text-red-600 mt-1">{absentCount}</p>
              </div>
              <AlertCircle className="w-12 h-12 text-red-100" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">متأخرون اليوم</p>
                <p className="text-3xl font-bold text-yellow-600 mt-1">{lateCount}</p>
              </div>
              <Clock className="w-12 h-12 text-yellow-100" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Attendance Table */}
      <Card>
        <CardHeader>
          <CardTitle>سجل الحضور لليوم</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">الموظف</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">وقت الحضور</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">وقت الانصراف</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">الحالة</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">الملاحظات</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                      جاري التحميل...
                    </td>
                  </tr>
                ) : todayAttendance.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                      لا توجد سجلات حضور لليوم
                    </td>
                  </tr>
                ) : (
                  todayAttendance.map((record: any) => {
                    const statusInfo = getAttendanceStatus(record.status);
                    return (
                      <tr key={record.id} className="border-t hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-900 font-medium">
                          {getEmployeeName(record.employeeId)}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {record.checkInTime || '-'}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {record.checkOutTime || '-'}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
                            {statusInfo.label}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {record.notes || '-'}
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

      {/* Historical Data */}
      <Card>
        <CardHeader>
          <CardTitle>إحصائيات الحضور الشهرية</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-gray-600 text-sm">متوسط الحضور</p>
              <p className="text-3xl font-bold text-green-600 mt-2">95%</p>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <p className="text-gray-600 text-sm">متوسط التأخير</p>
              <p className="text-3xl font-bold text-yellow-600 mt-2">5%</p>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <p className="text-gray-600 text-sm">متوسط الغياب</p>
              <p className="text-3xl font-bold text-red-600 mt-2">2%</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
