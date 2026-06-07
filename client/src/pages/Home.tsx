import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import Dashboard from './Dashboard';
import Employees from './Employees';
import Organization from './Organization';
import Contracts from './Contracts';
import Documents from './Documents';
import Approvals from './Approvals';
import Attendance from './Attendance';
import Settings from './Settings';

export default function Home() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard onNavigate={setActiveTab} />;
      case 'employees':
        return <Employees />;
      case 'organization':
        return <Organization />;
      case 'contracts':
        return <Contracts />;
      case 'documents':
        return <Documents />;
      case 'approvals':
        return <Approvals />;
      case 'attendance':
        return <Attendance />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard onNavigate={setActiveTab} />;
    }
  };

  return (
    <div className="flex h-screen bg-[#f8fafc] overflow-hidden" dir="rtl">
      {/* Sidebar */}
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Header */}
        <Header onSearch={setSearchQuery} />

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}
