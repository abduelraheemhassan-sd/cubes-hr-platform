import { useState } from 'react';
import {
  LayoutGrid,
  Users,
  Building2,
  FileText,
  CheckSquare,
  Clock,
  Settings,
  Menu,
  X,
} from 'lucide-react';

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  badge?: number;
}

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const navItems: NavItem[] = [
  { id: 'dashboard', label: 'لوحة HR', icon: <LayoutGrid className="w-5 h-5" /> },
  { id: 'employees', label: 'الموظفون', icon: <Users className="w-5 h-5" /> },
  { id: 'organization', label: 'الهيكل التنظيمي', icon: <Building2 className="w-5 h-5" /> },
  { id: 'contracts', label: 'العقود', icon: <FileText className="w-5 h-5" /> },
  { id: 'documents', label: 'الوثائق', icon: <FileText className="w-5 h-5" /> },
  { id: 'approvals', label: 'الموافقات', icon: <CheckSquare className="w-5 h-5" />, badge: 2 },
  { id: 'attendance', label: 'الحضور والغياب', icon: <Clock className="w-5 h-5" /> },
  { id: 'settings', label: 'الإعدادات', icon: <Settings className="w-5 h-5" /> },
];

export default function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const isActive = (id: string) => activeTab === id;
  const getNavItemClass = (id: string) => {
    const baseClass = 'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-all relative';
    const activeClass = 'bg-primary/10 text-primary';
    const inactiveClass = 'text-gray-600 hover:bg-gray-50 hover:text-gray-950';
    return isActive(id) ? `${baseClass} ${activeClass}` : `${baseClass} ${inactiveClass}`;
  };

  const handleNavClick = (id: string) => {
    onTabChange(id);
    setIsOpen(false);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 right-4 z-50 p-2 rounded-lg bg-primary text-primary-foreground lg:hidden"
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Sidebar */}
      <aside
        className={`${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        } lg:translate-x-0 fixed lg:static top-0 right-0 w-64 h-screen bg-white border-l border-gray-200 flex flex-col overflow-y-auto transition-transform duration-300 z-40`}
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold text-lg">
              CH
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900">CubesHR</p>
              <p className="text-[11px] text-gray-500 font-medium">نظام دورة حياة الموظف</p>
            </div>
          </div>
          <span className="bg-primary/10 text-primary text-[10px] font-bold px-2 py-0.5 rounded-full">
            Core HR
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          <p className="px-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">
            القائمة الرئيسية
          </p>

          {navItems.slice(0, 7).map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={getNavItemClass(item.id)}
            >
              {item.icon}
              <span>{item.label}</span>
              {item.badge && (
                <span className="absolute left-3 top-1/2 -translate-y-1/2 bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}
            </button>
          ))}

          <div className="pt-4 mt-4 border-t border-gray-100" />
          <p className="px-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">
            إعدادات النظام
          </p>

          {navItems.slice(7).map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={getNavItemClass(item.id)}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 bg-gray-50 text-xs text-gray-500 text-center">
          <p className="font-bold text-gray-700">دعم فني متواصل</p>
          <p className="mt-1">app.cubes.ly</p>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
