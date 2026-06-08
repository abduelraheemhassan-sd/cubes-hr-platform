import { useState } from 'react';
import { trpc } from '@/lib/trpc';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Clock, XCircle, Eye, Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Spinner } from '@/components/ui/spinner';
import { toast } from 'sonner';

export default function Approvals() {
  const [selectedApproval, setSelectedApproval] = useState<any>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showApprovalDialog, setShowApprovalDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [approvalNotes, setApprovalNotes] = useState('');
  const [employeeSearchQuery, setEmployeeSearchQuery] = useState('');
  const [showEmployeeDropdown, setShowEmployeeDropdown] = useState(false);
  const [createFormData, setCreateFormData] = useState({
    requestType: '',
    description: '',
    priority: 'medium',
    dueDate: '',
    employeeId: undefined as number | undefined,
    employeeName: '',
  });

  const { data: approvals = [], isLoading, refetch } = trpc.approvals.list.useQuery();
  const { data: employees = [] } = trpc.employees.list.useQuery();

  const approveMutation = trpc.approvals.approve.useMutation({
    onSuccess: () => {
      toast.success('تمت الموافقة على الطلب بنجاح');
      setShowApprovalDialog(false);
      setApprovalNotes('');
      setSelectedApproval(null);
      refetch();
    },
    onError: (error) => {
      toast.error(`خطأ: ${error.message}`);
    },
  });

  const rejectMutation = trpc.approvals.reject.useMutation({
    onSuccess: () => {
      toast.success('تم رفض الطلب بنجاح');
      setShowRejectDialog(false);
      setRejectionReason('');
      setSelectedApproval(null);
      refetch();
    },
    onError: (error) => {
      toast.error(`خطأ: ${error.message}`);
    },
  });

  const createMutation = trpc.approvals.create.useMutation({
    onSuccess: () => {
      toast.success('تم إنشاء طلب الموافقة بنجاح');
      setShowCreateDialog(false);
      setCreateFormData({
        requestType: '',
        description: '',
        priority: 'medium',
        dueDate: '',
        employeeId: undefined,
        employeeName: '',
      });
      refetch();
    },
    onError: (error) => {
      toast.error(`خطأ: ${error.message}`);
    },
  });

  const filteredEmployees = employees.filter((emp: any) =>
    `${emp.firstName} ${emp.lastName}`.toLowerCase().includes(employeeSearchQuery.toLowerCase()) ||
    emp.email.toLowerCase().includes(employeeSearchQuery.toLowerCase())
  );

  const filteredApprovals = approvals.filter((approval: any) => {
    const matchStatus = filterStatus === 'all' || approval.status === filterStatus;
    const matchType = filterType === 'all' || approval.requestType === filterType;
    const matchSearch =
      approval.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      approval.requestType.toLowerCase().includes(searchQuery.toLowerCase());
    return matchStatus && matchType && matchSearch;
  });

  const getRequestTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      leave: 'إجازة',
      contract: 'عقد',
      document: 'وثيقة',
      employee_action: 'إجراء موظف',
      salary_change: 'تغيير راتب',
    };
    return labels[type] || type;
  };

  const getApprovalStatus = (status: string) => {
    const statuses: Record<string, { label: string; color: string; icon: any }> = {
      pending: { label: 'قيد الانتظار', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
      approved: { label: 'موافق عليه', color: 'bg-green-100 text-green-800', icon: CheckCircle },
      rejected: { label: 'مرفوض', color: 'bg-red-100 text-red-800', icon: XCircle },
    };
    return statuses[status] || { label: status, color: 'bg-blue-100 text-blue-800', icon: Clock };
  };

  const getPriorityBadge = (priority: string) => {
    const colors: Record<string, string> = {
      low: 'bg-blue-100 text-blue-800',
      medium: 'bg-orange-100 text-orange-800',
      high: 'bg-red-100 text-red-800',
    };
    const labels: Record<string, string> = {
      low: 'منخفضة',
      medium: 'متوسطة',
      high: 'عالية',
    };
    return (
      <Badge className={colors[priority] || 'bg-gray-100 text-gray-800'}>
        {labels[priority] || priority}
      </Badge>
    );
  };

  const getEmployeeName = (employeeId?: number) => {
    if (!employeeId) return 'بدون موظف محدد';
    const emp = employees.find((e: any) => e.id === employeeId);
    return emp ? `${emp.firstName} ${emp.lastName}` : 'موظف غير معروف';
  };

  const pendingApprovals = approvals.filter((a: any) => a.status === 'pending').length;
  const approvedApprovals = approvals.filter((a: any) => a.status === 'approved').length;
  const rejectedApprovals = approvals.filter((a: any) => a.status === 'rejected').length;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">الموافقات</h1>
          <p className="text-gray-600 mt-1">إدارة الموافقات والقرارات المعلقة</p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 ml-2" />
              طلب موافقة جديد
            </Button>
          </DialogTrigger>
          <DialogContent dir="rtl" className="max-w-md max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>إنشاء طلب موافقة جديد</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {/* اختيار الموظف */}
              <div>
                <label className="text-sm font-semibold">الموظف:</label>
                <div className="relative">
                  <Input
                    placeholder="ابحث عن موظف..."
                    value={employeeSearchQuery}
                    onChange={(e) => {
                      setEmployeeSearchQuery(e.target.value);
                      setShowEmployeeDropdown(true);
                    }}
                    onFocus={() => setShowEmployeeDropdown(true)}
                  />
                  {showEmployeeDropdown && employeeSearchQuery && (
                    <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-md mt-1 max-h-40 overflow-y-auto z-10">
                      {filteredEmployees.length > 0 ? (
                        filteredEmployees.map((emp: any) => (
                          <div
                            key={emp.id}
                            className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                            onClick={() => {
                              setCreateFormData({
                                ...createFormData,
                                employeeId: emp.id,
                                employeeName: `${emp.firstName} ${emp.lastName}`,
                              });
                              setEmployeeSearchQuery('');
                              setShowEmployeeDropdown(false);
                            }}
                          >
                            <div className="font-semibold">{`${emp.firstName} ${emp.lastName}`}</div>
                            <div className="text-sm text-gray-500">{emp.email}</div>
                          </div>
                        ))
                      ) : (
                        <div className="px-3 py-2 text-gray-500">لا توجد نتائج</div>
                      )}
                    </div>
                  )}
                </div>
                {createFormData.employeeName && (
                  <div className="mt-2 p-2 bg-blue-50 rounded-md">
                    <p className="text-sm">
                      الموظف المختار: <span className="font-semibold">{createFormData.employeeName}</span>
                    </p>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setCreateFormData({
                          ...createFormData,
                          employeeId: undefined,
                          employeeName: '',
                        });
                      }}
                      className="text-xs mt-1"
                    >
                      إزالة
                    </Button>
                  </div>
                )}
              </div>

              <div>
                <label className="text-sm font-semibold">نوع الطلب:</label>
                <Select value={createFormData.requestType} onValueChange={(value) => setCreateFormData({...createFormData, requestType: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر نوع الطلب" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="leave">إجازة</SelectItem>
                    <SelectItem value="contract">عقد</SelectItem>
                    <SelectItem value="document">وثيقة</SelectItem>
                    <SelectItem value="employee_action">إجراء موظف</SelectItem>
                    <SelectItem value="salary_change">تغيير راتب</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-semibold">الوصف:</label>
                <Textarea
                  placeholder="اشرح طلبك..."
                  value={createFormData.description}
                  onChange={(e) => setCreateFormData({...createFormData, description: e.target.value})}
                />
              </div>
              <div>
                <label className="text-sm font-semibold">الأولوية:</label>
                <Select value={createFormData.priority} onValueChange={(value) => setCreateFormData({...createFormData, priority: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">منخفضة</SelectItem>
                    <SelectItem value="medium">متوسطة</SelectItem>
                    <SelectItem value="high">عالية</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-semibold">الموعد النهائي (اختياري):</label>
                <Input
                  type="date"
                  value={createFormData.dueDate}
                  onChange={(e) => setCreateFormData({...createFormData, dueDate: e.target.value})}
                />
              </div>
              <Button
                onClick={() => {
                  if (!createFormData.requestType || !createFormData.description) {
                    toast.error('يرجى ملء جميع الحقول المطلوبة');
                    return;
                  }
                  createMutation.mutate({
                    requestType: createFormData.requestType as any,
                    description: createFormData.description,
                    priority: createFormData.priority as any,
                    dueDate: createFormData.dueDate ? new Date(createFormData.dueDate) : undefined,
                    employeeId: createFormData.employeeId,
                  });
                }}
                disabled={createMutation.isPending}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                {createMutation.isPending ? 'جاري...' : 'إنشاء الطلب'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">قيد الانتظار</p>
                <p className="text-3xl font-bold text-yellow-600 mt-1">{pendingApprovals}</p>
              </div>
              <Clock className="w-12 h-12 text-yellow-100" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">موافق عليها</p>
                <p className="text-3xl font-bold text-green-600 mt-1">{approvedApprovals}</p>
              </div>
              <CheckCircle className="w-12 h-12 text-green-100" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">مرفوضة</p>
                <p className="text-3xl font-bold text-red-600 mt-1">{rejectedApprovals}</p>
              </div>
              <XCircle className="w-12 h-12 text-red-100" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="ابحث عن طلب..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger>
                <SelectValue placeholder="حالة الطلب" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الحالات</SelectItem>
                <SelectItem value="pending">قيد الانتظار</SelectItem>
                <SelectItem value="approved">موافق عليه</SelectItem>
                <SelectItem value="rejected">مرفوض</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger>
                <SelectValue placeholder="نوع الطلب" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الأنواع</SelectItem>
                <SelectItem value="leave">إجازة</SelectItem>
                <SelectItem value="contract">عقد</SelectItem>
                <SelectItem value="document">وثيقة</SelectItem>
                <SelectItem value="employee_action">إجراء موظف</SelectItem>
                <SelectItem value="salary_change">تغيير راتب</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Approvals List */}
      {filteredApprovals.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-gray-500">لا توجد طلبات موافقات</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredApprovals.map((approval: any) => {
            const statusInfo = getApprovalStatus(approval.status);
            return (
              <Card key={approval.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold">
                          {getRequestTypeLabel(approval.requestType)}
                        </h3>
                        <Badge className={statusInfo.color}>
                          {statusInfo.label}
                        </Badge>
                        {approval.priority && getPriorityBadge(approval.priority)}
                      </div>
                      <p className="text-gray-600 mb-2">{approval.description}</p>
                      <div className="flex gap-4 text-sm text-gray-500 mb-2">
                        <span>
                          الموظف: <span className="font-semibold">{getEmployeeName(approval.employeeId)}</span>
                        </span>
                        <span>
                          تاريخ الإنشاء: {new Date(approval.createdAt).toLocaleDateString('ar-EG')}
                        </span>
                        {approval.dueDate && (
                          <span>
                            الموعد النهائي: {new Date(approval.dueDate).toLocaleDateString('ar-EG')}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedApproval(approval)}
                          >
                            <Eye className="w-4 h-4 ml-2" />
                            عرض
                          </Button>
                        </DialogTrigger>
                        <DialogContent dir="rtl" className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>تفاصيل الطلب</DialogTitle>
                          </DialogHeader>
                          {selectedApproval && (
                            <div className="space-y-4">
                              <div>
                                <label className="text-sm font-semibold">نوع الطلب:</label>
                                <p>{getRequestTypeLabel(selectedApproval.requestType)}</p>
                              </div>
                              <div>
                                <label className="text-sm font-semibold">الموظف:</label>
                                <p>{getEmployeeName(selectedApproval.employeeId)}</p>
                              </div>
                              <div>
                                <label className="text-sm font-semibold">الوصف:</label>
                                <p>{selectedApproval.description}</p>
                              </div>
                              <div>
                                <label className="text-sm font-semibold">الحالة:</label>
                                <div className="mt-1">
                                  <Badge className={getApprovalStatus(selectedApproval.status).color}>
                                    {getApprovalStatus(selectedApproval.status).label}
                                  </Badge>
                                </div>
                              </div>
                              {selectedApproval.notes && (
                                <div>
                                  <label className="text-sm font-semibold">ملاحظات:</label>
                                  <p>{selectedApproval.notes}</p>
                                </div>
                              )}
                              {selectedApproval.rejectionReason && (
                                <div>
                                  <label className="text-sm font-semibold">سبب الرفض:</label>
                                  <p>{selectedApproval.rejectionReason}</p>
                                </div>
                              )}
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>

                      {approval.status === 'pending' && (
                        <>
                          <Dialog open={showApprovalDialog} onOpenChange={setShowApprovalDialog}>
                            <DialogTrigger asChild>
                              <Button
                                size="sm"
                                className="bg-green-600 hover:bg-green-700"
                                onClick={() => setSelectedApproval(approval)}
                              >
                                <CheckCircle className="w-4 h-4 ml-2" />
                                موافقة
                              </Button>
                            </DialogTrigger>
                            <DialogContent dir="rtl">
                              <DialogHeader>
                                <DialogTitle>الموافقة على الطلب</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div>
                                  <label className="text-sm font-semibold">ملاحظات (اختياري):</label>
                                  <Input
                                    placeholder="أضف ملاحظات..."
                                    value={approvalNotes}
                                    onChange={(e) => setApprovalNotes(e.target.value)}
                                  />
                                </div>
                                <Button
                                  onClick={() =>
                                    approveMutation.mutate({
                                      approvalId: selectedApproval.id,
                                      notes: approvalNotes,
                                    })
                                  }
                                  disabled={approveMutation.isPending}
                                  className="w-full bg-green-600 hover:bg-green-700"
                                >
                                  {approveMutation.isPending ? 'جاري...' : 'تأكيد الموافقة'}
                                </Button>
                              </div>
                            </DialogContent>
                          </Dialog>

                          <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
                            <DialogTrigger asChild>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => setSelectedApproval(approval)}
                              >
                                <XCircle className="w-4 h-4 ml-2" />
                                رفض
                              </Button>
                            </DialogTrigger>
                            <DialogContent dir="rtl">
                              <DialogHeader>
                                <DialogTitle>رفض الطلب</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div>
                                  <label className="text-sm font-semibold">سبب الرفض:</label>
                                  <Input
                                    placeholder="اشرح سبب الرفض..."
                                    value={rejectionReason}
                                    onChange={(e) => setRejectionReason(e.target.value)}
                                  />
                                </div>
                                <div>
                                  <label className="text-sm font-semibold">ملاحظات إضافية (اختياري):</label>
                                  <Input
                                    placeholder="أضف ملاحظات..."
                                    value={approvalNotes}
                                    onChange={(e) => setApprovalNotes(e.target.value)}
                                  />
                                </div>
                                <Button
                                  onClick={() =>
                                    rejectMutation.mutate({
                                      approvalId: selectedApproval.id,
                                      rejectionReason,
                                      notes: approvalNotes,
                                    })
                                  }
                                  disabled={rejectMutation.isPending}
                                  className="w-full bg-red-600 hover:bg-red-700"
                                >
                                  {rejectMutation.isPending ? 'جاري...' : 'تأكيد الرفض'}
                                </Button>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
