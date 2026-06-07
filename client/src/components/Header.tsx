import { Search, Calendar } from 'lucide-react';

interface HeaderProps {
  onSearch: (query: string) => void;
}

export default function Header({ onSearch }: HeaderProps) {
  const today = new Date();
  const dayNames = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
  const monthNames = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
  
  const dayName = dayNames[today.getDay()];
  const date = today.getDate();
  const monthName = monthNames[today.getMonth()];
  const year = today.getFullYear();

  return (
    <header className="bg-white border-b border-gray-200 p-4 flex items-center justify-between sticky top-0 z-10">
      {/* Search Bar */}
      <div className="relative w-1/3 min-w-[280px]">
        <div className="absolute inset-y-0 right-0 pl-3 flex items-center pointer-events-none pr-3">
          <Search className="w-4 h-4 text-gray-400" />
        </div>
        <input
          type="text"
          onChange={(e) => onSearch(e.target.value)}
          className="block w-full pl-3 pr-10 py-2 border border-gray-200 rounded-lg text-xs placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-gray-50 transition-all"
          placeholder="ابحث عن موظف، عقد، أو طلب..."
        />
      </div>

      {/* Date and User Info */}
      <div className="flex items-center gap-4">
        <div className="flex items-center text-xs text-gray-600 bg-gray-100 rounded-lg px-3 py-1.5 font-medium">
          <Calendar className="w-4 h-4 ml-2 text-primary" />
          اليوم: {dayName}، {date} {monthName} {year}
        </div>
        <div className="h-8 w-px bg-gray-200" />
        <div className="flex items-center gap-2">
          <div className="text-left">
            <p className="text-xs font-bold text-gray-900">أحمد المدير</p>
            <p className="text-[10px] text-gray-400">مسؤول الموارد البشرية</p>
          </div>
          <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
            أ م
          </div>
        </div>
      </div>
    </header>
  );
}
