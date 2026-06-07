import { useState } from 'react';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Edit2, Trash2, Search, Eye } from 'lucide-react';
import { toast } from 'sonner';

export default function Employees() {
  const [searchQuery, setSearchQuery] = useState('');
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
  });

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
    });
    setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.firstName || !formData.lastName || !formData.email) {
      toast.error('يرجى ملء الحقول المطلوبة');
      return;
    }

    if (editingId) {
      updateMutation.mutate({
        id: editingId,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        position: formData.position,
        departmentId: formData.department ? parseInt(formData.department) : undefined,
      });
    } else {
      createMutation.mutate({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        position: formData.position,
        departmentId: formData.department ? parseInt(formData.department) : undefined,
        hireDate: new Date().toISOString().split('T')[0],
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
    });
    setEditingId(employee.id);
    setIsOpen(true);
  };

  const handleViewDetails = (employee: any) => {
    setSelectedEmployee(employee);
    setIsDetailOpen(true);
  };

  const filteredEmployees = employees.filter(emp =>
    emp.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getNationalityLabel = (code: string) => {
    const nationalities: { [key: string]: string } = {
      'SA': 'سعودي',
      'AE': 'إماراتي',
      'KW': 'كويتي',
      'QA': 'قطري',
      'BH': 'بحريني',
      'OM': 'عماني',
      'LY': 'ليبي',
      'EG': 'مصري',
      'SY': 'سوري',
      'JO': 'أردني',
    };
    return nationalities[code] || code;
  };

  const getIdTypeLabel = (type: string) => {
    const types: { [key: string]: string } = {
      'national_id': 'الهوية الوطنية',
      'passport': 'جواز السفر',
      'residency': 'الإقامة',
      'driving_license': 'رخصة القيادة',
      'personal_card': 'البطاقة الشخصية',
    };
    return types[type] || type;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
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
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-right">إضافة موظف جديد للمنظمة</DialogTitle>
              <p className="text-sm text-gray-600 mt-2 text-right">يرجى ملء البيانات لإنشاء ملف وظيفي للموظف بالمنظمة</p>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Row 1: First Name & Last Name */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    الاسم الأول *
                  </label>
                  <Input
                    placeholder="أدخل الاسم الأول"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    اسم العائلة *
                  </label>
                  <Input
                    placeholder="أدخل اسم العائلة"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    required
                  />
                </div>
              </div>

              {/* Row 2: Email & Department */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    البريد الإلكتروني *
                  </label>
                  <Input
                    type="email"
                    placeholder="البريد الإلكتروني"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    القسم *
                  </label>
                  <Select value={formData.department} onValueChange={(value) => setFormData({ ...formData, department: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر القسم" />
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

              {/* Row 3: Position & Phone */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    المسمى الوظيفي *
                  </label>
                  <Input
                    placeholder="المسمى الوظيفي"
                    value={formData.position}
                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    رقم الهاتف *
                  </label>
                  <Input
                    type="tel"
                    placeholder="رقم الهاتف"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                  />
                </div>
              </div>

              {/* Row 4: Nationality */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  الجنسية *
                </label>
                <Input
                  placeholder="أدخل الجنسية"
                  value={formData.nationality}
                  onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
                  list="nationalities"
                  required
                />
                <datalist id="nationalities">
                  <option value="سعودي" />
                  <option value="إماراتي" />
                  <option value="كويتي" />
                  <option value="قطري" />
                  <option value="بحريني" />
                  <option value="عماني" />
                  <option value="ليبي" />
                  <option value="مصري" />
                  <option value="سوري" />
                  <option value="أردني" />
                </datalist>
              </div>

              {/* Row 5: ID Type & ID Number */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    نوع الوثيقة *
                  </label>
                  <Select value={formData.idType} onValueChange={(value) => setFormData({ ...formData, idType: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر نوع الوثيقة" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="national_id">الهوية الوطنية</SelectItem>
                      <SelectItem value="passport">جواز السفر</SelectItem>
                      <SelectItem value="residency">الإقامة</SelectItem>
                      <SelectItem value="driving_license">رخصة القيادة</SelectItem>
                      <SelectItem value="personal_card">البطاقة الشخصية</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    رقم الوثيقة *
                  </label>
                  <Input
                    placeholder="رقم الوثيقة"
                    value={formData.idNumber}
                    onChange={(e) => setFormData({ ...formData, idNumber: e.target.value })}
                    required
                  />
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-4">
                <Button
                  type="submit"
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  حفظ الموظف وتفعيل الملف
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => { setIsOpen(false); resetForm(); }}
                  className="flex-1"
                >
                  إلغاء
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">إجمالي الموظفين</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{employees.length}</p>
              </div>
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                <Plus className="w-6 h-6 text-indigo-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">موظفون نشطون</p>
                <p className="text-3xl font-bold text-green-600 mt-1">{employees.length}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Plus className="w-6 h-6 text-green-600" />
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
                <Plus className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute right-3 top-3 w-5 h-5 text-gray-400" />
        <Input
          placeholder="ابحث عن موظف بالاسم أو البريد الإلكتروني..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pr-10"
        />
      </div>

      {/* Employees Table */}
      <Card>
        <CardHeader>
          <CardTitle>قائمة الموظفين ({filteredEmployees.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">الاسم</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">البريد الإلكتروني</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">المسمى الوظيفي</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">رقم الهاتف</th>
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
                ) : filteredEmployees.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                      لا توجد بيانات
                    </td>
                  </tr>
                ) : (
                  filteredEmployees.map((employee: any) => (
                    <tr key={employee.id} className="border-t hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-900 font-medium">
                        {employee.firstName} {employee.lastName}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">{employee.email}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{employee.position || '-'}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{employee.phone || '-'}</td>
                      <td className="px-4 py-3 text-sm">
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          نشط
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewDetails(employee)}
                            className="text-blue-600 hover:text-blue-700"
                            title="عرض التفاصيل"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(employee)}
                            className="text-indigo-600 hover:text-indigo-700"
                            title="تعديل"
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              if (confirm('هل أنت متأكد من حذف هذا الموظف؟')) {
                                deleteMutation.mutate({ id: employee.id });
                              }
                            }}
                            className="text-red-600 hover:text-red-700"
                            title="حذف"
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

      {/* Employee Details Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-right">تفاصيل الموظف</DialogTitle>
          </DialogHeader>
          
          {selectedEmployee && (
            <div className="space-y-6">
              {/* Personal Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">المعلومات الشخصية</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">الاسم الأول</p>
                    <p className="text-lg font-semibold text-gray-900 mt-1">{selectedEmployee.firstName}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">اسم العائلة</p>
                    <p className="text-lg font-semibold text-gray-900 mt-1">{selectedEmployee.lastName}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">البريد الإلكتروني</p>
                    <p className="text-lg font-semibold text-gray-900 mt-1">{selectedEmployee.email}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">رقم الهاتف</p>
                    <p className="text-lg font-semibold text-gray-900 mt-1">{selectedEmployee.phone || '-'}</p>
                  </div>
                </div>
              </div>

              {/* Job Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">معلومات الوظيفة</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">المسمى الوظيفي</p>
                    <p className="text-lg font-semibold text-gray-900 mt-1">{selectedEmployee.position || '-'}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">القسم</p>
                    <p className="text-lg font-semibold text-gray-900 mt-1">
                      {departments.find((d: any) => d.id === selectedEmployee.departmentId)?.name || '-'}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">تاريخ المباشرة</p>
                    <p className="text-lg font-semibold text-gray-900 mt-1">
                      {selectedEmployee.hireDate ? new Date(selectedEmployee.hireDate).toLocaleDateString('ar-LY') : '-'}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">الحالة</p>
                    <p className="text-lg font-semibold text-green-600 mt-1">نشط</p>
                  </div>
                </div>
              </div>

              {/* Document Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">معلومات الوثائق</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">نوع الوثيقة</p>
                    <p className="text-lg font-semibold text-gray-900 mt-1">
                      {selectedEmployee.documentType ? getIdTypeLabel(selectedEmployee.documentType) : '-'}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">رقم الوثيقة</p>
                    <p className="text-lg font-semibold text-gray-900 mt-1">{selectedEmployee.nationalId || '-'}</p>
                  </div>
                </div>
              </div>

              {/* Close Button */}
              <div className="flex gap-3 pt-4">
                <Button
                  onClick={() => setIsDetailOpen(false)}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  إغلاق
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
