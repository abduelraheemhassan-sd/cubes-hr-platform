import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Settings, Lock, Bell, Users, Database, Shield } from 'lucide-react';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general');

  const tabs = [
    { id: 'general', label: 'الإعدادات العامة', icon: Settings },
    { id: 'security', label: 'الأمان', icon: Shield },
    { id: 'roles', label: 'الأدوار والصلاحيات', icon: Users },
    { id: 'notifications', label: 'الإشعارات', icon: Bell },
    { id: 'system', label: 'إعدادات النظام', icon: Database },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">الإعدادات</h1>
        <p className="text-gray-600 mt-1">إدارة إعدادات النظام والمستخدم</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-4 border-b">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 whitespace-nowrap rounded-lg transition-colors ${
                activeTab === tab.id
                  ? 'bg-indigo-100 text-indigo-700 font-medium'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* General Settings */}
      {activeTab === 'general' && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>معلومات المنظمة</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">اسم المنظمة</label>
                <input
                  type="text"
                  defaultValue="Cubes HR"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">البريد الإلكتروني</label>
                <input
                  type="email"
                  defaultValue="info@cubes.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">رقم الهاتف</label>
                <input
                  type="tel"
                  defaultValue="+966 50 000 0000"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">العنوان</label>
                <input
                  type="text"
                  defaultValue="الرياض، المملكة العربية السعودية"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <Button className="bg-indigo-600 hover:bg-indigo-700">حفظ التغييرات</Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Security Settings */}
      {activeTab === 'security' && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>كلمة المرور</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">كلمة المرور الحالية</label>
                <input
                  type="password"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">كلمة المرور الجديدة</label>
                <input
                  type="password"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">تأكيد كلمة المرور</label>
                <input
                  type="password"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <Button className="bg-indigo-600 hover:bg-indigo-700">تحديث كلمة المرور</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>المصادقة الثنائية</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600">تفعيل المصادقة الثنائية لزيادة أمان حسابك</p>
              <Button className="bg-indigo-600 hover:bg-indigo-700">تفعيل المصادقة الثنائية</Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Roles & Permissions */}
      {activeTab === 'roles' && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>الأدوار المتاحة</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {['مسؤول', 'مدير HR', 'مدير قسم', 'موظف'].map((role) => (
                  <div key={role} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium text-gray-900">{role}</span>
                    <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700">
                      تعديل الصلاحيات
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Notifications */}
      {activeTab === 'notifications' && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>تفضيلات الإشعارات</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { label: 'إشعارات البريد الإلكتروني', checked: true },
                { label: 'إشعارات الموافقات', checked: true },
                { label: 'إشعارات الحضور', checked: false },
                { label: 'إشعارات النظام', checked: true },
              ].map((notif) => (
                <div key={notif.label} className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    defaultChecked={notif.checked}
                    className="w-4 h-4 rounded border-gray-300 text-indigo-600"
                  />
                  <label className="text-sm text-gray-700">{notif.label}</label>
                </div>
              ))}
              <Button className="bg-indigo-600 hover:bg-indigo-700">حفظ الإشعارات</Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* System Settings */}
      {activeTab === 'system' && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>معلومات النظام</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">إصدار النظام</span>
                <span className="font-medium">1.0.0</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">آخر تحديث</span>
                <span className="font-medium">7 يونيو 2026</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">قاعدة البيانات</span>
                <span className="font-medium">MySQL 8.0</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-600">الخادم</span>
                <span className="font-medium">Node.js Express</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>النسخ الاحتياطي</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600">إنشاء نسخة احتياطية من بيانات النظام</p>
              <Button className="bg-indigo-600 hover:bg-indigo-700">إنشاء نسخة احتياطية الآن</Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
