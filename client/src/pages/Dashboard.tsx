import { Users, CheckCircle, AlertCircle, AlertTriangle } from 'lucide-react';

interface DashboardProps {
  onNavigate: (tab: string) => void;
}

export default function Dashboard({ onNavigate }: DashboardProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-black text-gray-900">لوحة الموارد البشرية</h1>
          <p className="text-xs text-gray-500 mt-1">نظرة شاملة على الموظفين، الحضور، الإجازات، الموافقات، والوثائق.</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1: Active Employees */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-xs font-bold text-gray-500">الموظفون النشطون</p>
              <h3 className="text-3xl font-black text-gray-900 mt-1">10</h3>
            </div>
            <div className="p-2 bg-green-50 rounded-lg text-green-600">
              <Users className="w-6 h-6" />
            </div>
          </div>
          <div className="flex items-center text-[11px] text-green-600 font-bold mb-3">
            <span>↑ 12 جديد هذا الشهر</span>
          </div>
          <div className="h-10 w-full bg-gradient-to-r from-green-100 to-green-50 rounded-lg" />
        </div>

        {/* Card 2: Attendance Coverage */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-xs font-bold text-gray-500">تغطية الحضور اليوم</p>
              <h3 className="text-3xl font-black text-gray-900 mt-1">30%</h3>
            </div>
            <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
              <CheckCircle className="w-6 h-6" />
            </div>
          </div>
          <div className="flex items-center text-[11px] text-gray-500 font-bold mb-3">
            <span>0 حاضر، 3 استثناء</span>
          </div>
          <div className="h-10 w-full bg-gradient-to-r from-blue-100 to-blue-50 rounded-lg" />
        </div>

        {/* Card 3: Pending Approvals */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-xs font-bold text-gray-500">الموافقات المعلقة</p>
              <h3 className="text-3xl font-black text-gray-900 mt-1">2</h3>
            </div>
            <div className="p-2 bg-orange-50 rounded-lg text-orange-600">
              <AlertCircle className="w-6 h-6" />
            </div>
          </div>
          <div className="flex items-center text-[11px] text-gray-500 font-bold mb-3">
            <span>يحتاج مراجعة عاجلة</span>
          </div>
          <div className="h-10 w-full bg-gradient-to-r from-orange-100 to-orange-50 rounded-lg" />
        </div>

        {/* Card 4: Document Risks */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-xs font-bold text-gray-500">مخاطر الوثائق والعقود</p>
              <h3 className="text-3xl font-black text-red-600 mt-1">12</h3>
            </div>
            <div className="p-2 bg-red-50 rounded-lg text-red-600">
              <AlertTriangle className="w-6 h-6" />
            </div>
          </div>
          <div className="flex items-center text-[11px] text-red-500 font-bold mb-3">
            <span>↑ 9 وثائق، 2 عقود قريبة</span>
          </div>
          <div className="h-10 w-full bg-gradient-to-r from-red-100 to-red-50 rounded-lg" />
        </div>
      </div>

      {/* Alert Banner */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3 text-amber-800">
          <AlertTriangle className="w-6 h-6" />
          <div>
            <span className="font-bold text-sm block">قائمة متابعة HR الفورية:</span>
            <span className="text-xs text-amber-700">انقر على أي من العناصر أدناه للانتقال للمهمة واتخاذ القرار.</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-4">
          <button
            onClick={() => onNavigate('approvals')}
            className="cursor-pointer hover:bg-amber-100 flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-amber-100 shadow-sm transition-all"
          >
            <span className="text-amber-600 font-black text-sm">2</span>
            <span className="text-xs text-gray-600">موافقات معلقة<br /><span className="text-[9px] text-gray-400">بانتظار قرارك</span></span>
          </button>
          <button
            onClick={() => onNavigate('attendance')}
            className="cursor-pointer hover:bg-amber-100 flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-amber-100 shadow-sm transition-all"
          >
            <span className="text-blue-600 font-black text-sm">3</span>
            <span className="text-xs text-gray-600">استثناءات حضور<br /><span className="text-[9px] text-gray-400">تحتاج اعتماد</span></span>
          </button>
          <button
            onClick={() => onNavigate('documents')}
            className="cursor-pointer hover:bg-amber-100 flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-amber-100 shadow-sm transition-all"
          >
            <span className="text-orange-600 font-black text-sm">9</span>
            <span className="text-xs text-gray-600">وثائق ناقصة<br /><span className="text-[9px] text-gray-400">متابعة الأوراق</span></span>
          </button>
          <button
            onClick={() => onNavigate('contracts')}
            className="cursor-pointer hover:bg-amber-100 flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-red-100 shadow-sm transition-all"
          >
            <span className="text-red-600 font-black text-sm">2</span>
            <span className="text-xs text-gray-600">عقود قاربت الانتهاء<br /><span className="text-[9px] text-gray-400">تجديد أو إنهاء</span></span>
          </button>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* System Status */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-gray-800 text-sm mb-4">حالة النظام التشغيلي</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-600">اكتمال ملفات الموظفين</span>
                  <span className="font-bold text-green-600">100%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div className="bg-green-500 h-1.5 rounded-full" style={{ width: '100%' }} />
                </div>
                <p className="text-[9px] text-gray-400 mt-0.5">من 10 مكتمل</p>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-600">إدخال الحضور</span>
                  <span className="font-bold text-primary">30%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div className="bg-primary h-1.5 rounded-full" style={{ width: '30%' }} />
                </div>
                <p className="text-[9px] text-gray-400 mt-0.5">3 سجل حضور اليوم</p>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-600">الوثائق المطلوبة</span>
                  <span className="font-bold text-orange-500">25%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div className="bg-orange-400 h-1.5 rounded-full" style={{ width: '25%' }} />
                </div>
                <p className="text-[9px] text-gray-400 mt-0.5">9 عناصر تحتاج مراجعة</p>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-100 pt-3 mt-4 text-center">
            <button
              onClick={() => onNavigate('employees')}
              className="text-xs text-primary font-bold hover:underline"
            >
              عرض وإدارة الهيكل التنظيمي ←
            </button>
          </div>
        </div>

        {/* Attendance Details */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex flex-col">
          <h3 className="font-bold text-gray-800 text-sm mb-4">تفاصيل الحضور اليوم</h3>
          <div className="flex-1 flex items-center justify-center relative min-h-[140px]">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-green-400 via-orange-400 to-red-400" />
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-2xl font-black text-gray-800">30%</span>
              <span className="text-[10px] text-gray-400">تغطية</span>
            </div>
          </div>
          <div className="mt-4 flex justify-around text-center border-t border-gray-100 pt-3 text-xs">
            <div>
              <p className="text-lg font-black text-gray-800">3</p>
              <p className="text-[10px] text-gray-500">مكتمل</p>
            </div>
            <div>
              <p className="text-lg font-black text-orange-500">3</p>
              <p className="text-[10px] text-gray-500">استثناءات</p>
            </div>
            <div>
              <p className="text-lg font-black text-red-500">4</p>
              <p className="text-[10px] text-gray-500">غير مسجل</p>
            </div>
          </div>
        </div>

        {/* Today Summary */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex flex-col justify-between">
          <h3 className="font-bold text-gray-800 text-sm mb-4">ملخص اليوم</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg border border-gray-100">
              <div className="p-1.5 bg-green-100 text-green-600 rounded-md">
                📅
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-bold text-gray-800 truncate">في إجازة اليوم</h4>
                <p className="text-[10px] text-gray-400 truncate">موظفون خارج العمل</p>
              </div>
              <span className="text-sm font-bold text-gray-800">1</span>
            </div>
            <div className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg border border-gray-100">
              <div className="p-1.5 bg-purple-100 text-purple-600 rounded-md">
                ✈️
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-bold text-gray-800 truncate">في مأمورية اليوم</h4>
                <p className="text-[10px] text-gray-400 truncate">موظفون في مهمة</p>
              </div>
              <span className="text-sm font-bold text-gray-800">2</span>
            </div>
            <div className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg border border-gray-100">
              <div className="p-1.5 bg-blue-100 text-blue-600 rounded-md">
                🏥
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-bold text-gray-800 truncate">إجازة مرضية</h4>
                <p className="text-[10px] text-gray-400 truncate">موظفون في إجازة مرضية</p>
              </div>
              <span className="text-sm font-bold text-gray-800">1</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
