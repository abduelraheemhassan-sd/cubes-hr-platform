import { useState } from 'react';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Edit2, Trash2, Search, Eye, ChevronDown } from 'lucide-react';
import { toast } from 'sonner';
import EmployeeDetails from './EmployeeDetails';

export default function Employees() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
  const [isOpen, setIsOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    position: '',
    department: '',
    nationality: '',
    idType: '',
    idNumber: '',
    salary: '',
    hireDate: '',
  });

  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  const { data: employees = [], isLoading, refetch } = trpc.employees.list.useQuery();
  const { data: departments = [] } = trpc.departments.list.useQuery();
  
  const createMutation = trpc.employees.create.useMutation({
    onSuccess: () => {
      toast.success('تم إضافة الموظف بنجاح');
      refetch();
      resetForm();
      setIsOpen(false);
    },
    onError: (error) => {
      toast.error(error.message || 'حدث خطأ');
    },
  });

  const updateMutation = trpc.employees.update.useMutation({
    onSuccess: () => {
      toast.success('تم تحديث الموظف بنجاح');
      refetch();
      resetForm();
      setIsOpen(false);
    },
    onError: (error) => {
      toast.error(error.message || 'حدث خطأ');
    },
  });

  const deleteMutation = trpc.employees.delete.useMutation({
    onSuccess: () => {
      toast.success('تم حذف الموظف بنجاح');
      refetch();
    },
    onError: (error) => {
      toast.error(error.message || 'حدث خطأ');
    },
  });

  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      position: '',
      department: '',
      nationality: '',
      idType: '',
      idNumber: '',
      salary: '',
      hireDate: '',
    });
    setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.firstName || !formData.email || !formData.position || !formData.department) {
      toast.error('يرجى ملء الحقول المطلوبة: الاسم والبريد والمسمى والقسم');
      return;
    }

    // استخدام firstName كاسم رباعي ولقب ك姓 للتوافق مع البيانات
    const fullName = formData.firstName;
    const lastNamePart = formData.lastName || fullName.split(' ').pop() || 'User';

    if (editingId) {
      updateMutation.mutate({
        id: editingId,
        firstName: fullName,
        lastName: lastNamePart,
        email: formData.email,
        phone: formData.phone,
        position: formData.position,
        departmentId: formData.department ? parseInt(formData.department) : undefined,
      });
    } else {
      createMutation.mutate({
        firstName: fullName,
        lastName: lastNamePart,
        email: formData.email,
        phone: formData.phone,
        position: formData.position,
        departmentId: formData.department ? parseInt(formData.department) : undefined,
        hireDate: formData.hireDate || new Date().toISOString().split('T')[0],
      });
    }
  };

  const handleEdit = (employee: any) => {
    setFormData({
      firstName: employee.firstName,
      lastName: employee.lastName,
      email: employee.email,
      phone: employee.phone || '',
      position: employee.position || '',
      department: employee.departmentId ? employee.departmentId.toString() : '',
      nationality: '',
      idType: '',
      idNumber: employee.nationalId || '',
      salary: employee.salary || '',
      hireDate: employee.hireDate || '',
    });
    setEditingId(employee.id);
    setIsOpen(true);
  };

  const handleViewDetails = (employee: any) => {
    setSelectedEmployee(employee);
    setIsDetailOpen(true);
  };

  // Filter employees by search query and department
  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = 
      emp.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.position?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesDepartment = selectedDepartment === 'all' || emp.departmentId?.toString() === selectedDepartment;
    
    return matchesSearch && matchesDepartment;
  });

  const getDepartmentName = (deptId: number | undefined) => {
    if (!deptId) return '-';
    const dept = departments.find((d: any) => d.id === deptId);
    return dept?.name || '-';
  };

  const getStatusLabel = (status: string) => {
    const statuses: { [key: string]: string } = {
      'active': 'نشط',
      'inactive': 'غير نشط',
      'on_leave': 'في إجازة',
    };
    return statuses[status] || 'نشط';
  };

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      'active': 'bg-green-100 text-green-800',
      'inactive': 'bg-gray-100 text-gray-800',
      'on_leave': 'bg-yellow-100 text-yellow-800',
    };
    return colors[status] || 'bg-green-100 text-green-800';
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  return (
    <div className="space-y-6">
      <EmployeeDetails
        employee={selectedEmployee}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
      />

      {/* Header Section */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">الموظفون</h1>
          <p className="text-gray-600 mt-1">إدارة بيانات الموظفين والعاملين بالمنظمة</p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { resetForm(); setIsOpen(true); }} className="bg-indigo-600 hover:bg-indigo-700">
              <Plus className="w-4 h-4 ml-2" />
              إضافة موظف جديد
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[95vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-right text-2xl font-bold">إضافة موظف جديد للمنظمة</DialogTitle>
              <p className="text-sm text-gray-600 mt-2 text-right">يرجى ملء البيانات لإنشاء ملف وظيفي ورقم وظيفي للموظف بالمنظمة</p>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Row 1: الاسم الرباعي والقسم */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">الاسم الرباعي *</label>
                  <Input
                    placeholder=""
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    required
                    className="text-right"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">المسمى الوظيفي *</label>
                  <Input
                    placeholder=""
                    value={formData.position}
                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                    required
                    className="text-right"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">القسم الفني *</label>
                  <Select value={formData.department} onValueChange={(value) => setFormData({ ...formData, department: value })}>
                    <SelectTrigger className="text-right">
                      <SelectValue placeholder="تقنية المعلومات" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((dept: any) => (
                        <SelectItem key={dept.id} value={dept.id.toString()}>
                          {dept.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Row 2: البريد الإلكتروني والجنسية والنوع */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">البريد الإلكتروني *</label>
                  <Input
                    type="email"
                    placeholder=""
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="text-right"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">الجنسية *</label>
                  <Input
                    placeholder=""
                    value={formData.nationality}
                    onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
                    className="text-right"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">نوع الإثبات *</label>
                  <Select value={formData.idType} onValueChange={(value) => setFormData({ ...formData, idType: value })}>
                    <SelectTrigger className="text-right">
                      <SelectValue placeholder="رقم وطني" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="national_id">رقم وطني</SelectItem>
                      <SelectItem value="passport">جواز سفر</SelectItem>
                      <SelectItem value="driving_license">رخصة قيادة</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Row 3: الراتب الأساسي وتاريخ المباشرة ورقم الإثبات */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">الراتب الأساسي (د.ل) *</label>
                  <div className="relative">
                    <Input
                      type="number"
                      placeholder=""
                      value={formData.salary}
                      onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                      className="text-right"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">تاريخ مباشرة العمل *</label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="date"
                      value={formData.hireDate}
                      onChange={(e) => setFormData({ ...formData, hireDate: e.target.value })}
                      className="text-right"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1 text-right">يوم / شهر / سنة</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">رقم الإثبات *</label>
                  <Input
                    placeholder=""
                    value={formData.idNumber}
                    onChange={(e) => setFormData({ ...formData, idNumber: e.target.value })}
                    className="text-right"
                  />
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-6 justify-start">
                <Button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-8"
                >
                  حفظ الموظف وتفعيل الملف
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => { setIsOpen(false); resetForm(); }}
                  className="px-8"
                >
                  إلغاء
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">إجمالي الموظفين المديرين</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{filteredEmployees.length}</p>
              </div>
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                <span className="text-lg">👥</span>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">الأقسام</p>
                <p className="text-3xl font-bold text-blue-600 mt-1">{departments.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-lg">🏢</span>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">الموظفون النشطون</p>
                <p className="text-3xl font-bold text-green-600 mt-1">{employees.length}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-lg">✓</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter Bar */}
      <div className="flex gap-4 items-end">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">البحث بالاسم أو المسمى الوظيفي...</label>
          <div className="relative">
            <Search className="absolute right-3 top-3 w-5 h-5 text-gray-400" />
            <Input
              placeholder="ابحث هنا..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-10"
            />
          </div>
        </div>
        <div className="w-48">
          <label className="block text-sm font-medium text-gray-700 mb-2">جميع الأقسام</label>
          <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
            <SelectTrigger className="flex items-center justify-between">
              <SelectValue placeholder="جميع الأقسام" />
              <ChevronDown className="w-4 h-4" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">جميع الأقسام</SelectItem>
              {departments.map((dept: any) => (
                <SelectItem key={dept.id} value={dept.id.toString()}>
                  {dept.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Employees Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            إجمالي الموظفين المديرين: {filteredEmployees.length} موظفين
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-4 text-right font-semibold text-gray-700">كود الموظف</th>
                  <th className="px-4 py-4 text-right font-semibold text-gray-700">اسم الموظف</th>
                  <th className="px-4 py-4 text-right font-semibold text-gray-700">المسمى الوظيفي</th>
                  <th className="px-4 py-4 text-right font-semibold text-gray-700">القسم</th>
                  <th className="px-4 py-4 text-right font-semibold text-gray-700">الجنسية والبيانات</th>
                  <th className="px-4 py-4 text-right font-semibold text-gray-700">تاريخ التعيين</th>
                  <th className="px-4 py-4 text-right font-semibold text-gray-700">الحالة</th>
                  <th className="px-4 py-4 text-right font-semibold text-gray-700">الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                      جاري التحميل...
                    </td>
                  </tr>
                ) : filteredEmployees.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                      لا توجد بيانات
                    </td>
                  </tr>
                ) : (
                  filteredEmployees.map((employee: any, index: number) => (
                    <tr key={employee.id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="px-4 py-4">
                        <span className="text-gray-600">EMP-{String(employee.id).padStart(4, '0')}</span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-xs font-bold text-indigo-600">
                            {getInitials(employee.firstName, employee.lastName)}
                          </div>
                          <span className="font-medium text-gray-900">{employee.firstName} {employee.lastName}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-gray-600">{employee.position || '-'}</td>
                      <td className="px-4 py-4 text-gray-600">{getDepartmentName(employee.departmentId)}</td>
                      <td className="px-4 py-4">
                        <div className="text-sm">
                          <p className="text-gray-900 font-medium">ليبي</p>
                          <p className="text-gray-600 text-xs">رقم الهوية: {employee.nationalId || '-'}</p>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-gray-600">
                        {employee.hireDate ? new Date(employee.hireDate).toLocaleDateString('ar-LY') : '-'}
                      </td>
                      <td className="px-4 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor('active')}`}>
                          {getStatusLabel('active')}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleViewDetails(employee)}
                            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleEdit(employee)}
                            className="text-green-600 hover:text-green-700 hover:bg-green-50"
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              if (confirm('هل أنت متأكد من حذف هذا الموظف؟')) {
                                deleteMutation.mutate({ id: employee.id });
                              }
                            }}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
