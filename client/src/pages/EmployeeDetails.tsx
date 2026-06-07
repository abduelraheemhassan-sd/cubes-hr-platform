import { useState } from 'react';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, X, Eye, Trash2, Download, Printer } from 'lucide-react';
import { toast } from 'sonner';

interface EmployeeDetailsProps {
  employee: any;
  isOpen: boolean;
  onClose: () => void;
}

export default function EmployeeDetails({ employee, isOpen, onClose }: EmployeeDetailsProps) {
  const [documentType, setDocumentType] = useState('');
  const [documentNumber, setDocumentNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [notes, setNotes] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [printingDocId, setPrintingDocId] = useState<number | null>(null);

  const { data: documents = [], refetch: refetchDocuments } = trpc.employeeDocuments.getByEmployeeId.useQuery(
    { employeeId: employee?.id || 0 },
    { enabled: !!employee?.id }
  );

  const createDocumentMutation = trpc.employeeDocuments.create.useMutation({
    onSuccess: () => {
      toast.success('تم رفع الوثيقة بنجاح');
      refetchDocuments();
      resetForm();
    },
    onError: (error) => {
      toast.error(error.message || 'حدث خطأ');
    },
  });

  const deleteDocumentMutation = trpc.employeeDocuments.delete.useMutation({
    onSuccess: () => {
      toast.success('تم حذف الوثيقة بنجاح');
      refetchDocuments();
    },
    onError: (error) => {
      toast.error(error.message || 'حدث خطأ');
    },
  });

  const resetForm = () => {
    setDocumentType('');
    setDocumentNumber('');
    setExpiryDate('');
    setNotes('');
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!documentType || !selectedFile) {
      toast.error('يرجى اختيار نوع الوثيقة وصورة');
      return;
    }

    // في تطبيق حقيقي، يجب رفع الصورة إلى S3 أولاً
    // هنا نستخدم base64 للعرض التوضيحي
    const reader = new FileReader();
    reader.onloadend = () => {
      const imageUrl = reader.result as string;
      createDocumentMutation.mutate({
        employeeId: employee.id,
        documentType,
        documentNumber: documentNumber || undefined,
        imageUrl,
        expiryDate: expiryDate || undefined,
        notes: notes || undefined,
      });
    };
    reader.readAsDataURL(selectedFile);
  };

  const getDocumentTypeLabel = (type: string) => {
    const types: { [key: string]: string } = {
      'national_id': 'الهوية الوطنية',
      'passport': 'جواز السفر',
      'residency': 'الإقامة',
      'driving_license': 'رخصة القيادة',
      'personal_card': 'البطاقة الشخصية',
    };
    return types[type] || type;
  };

  const handleDownloadDocument = (imageUrl: string, documentType: string, documentNumber?: string) => {
    try {
      const link = document.createElement('a');
      link.href = imageUrl;
      const fileName = `${getDocumentTypeLabel(documentType)}${documentNumber ? '_' + documentNumber : ''}.jpg`;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('تم تحميل الوثيقة بنجاح');
    } catch (error) {
      toast.error('فشل تحميل الوثيقة');
    }
  };

  const handlePrintDocument = (imageUrl: string, documentType: string) => {
    try {
      const printWindow = window.open('', '', 'height=600,width=800');
      if (printWindow) {
        printWindow.document.write(`
          <html dir="rtl">
            <head>
              <title>${getDocumentTypeLabel(documentType)}</title>
              <style>
                body { margin: 0; padding: 20px; font-family: Arial, sans-serif; }
                .print-container { text-align: center; }
                .print-container img { max-width: 100%; height: auto; margin: 20px 0; }
                .print-container h2 { margin: 10px 0; color: #333; }
                @media print {
                  body { margin: 0; padding: 0; }
                }
              </style>
            </head>
            <body>
              <div class="print-container">
                <h2>${getDocumentTypeLabel(documentType)}</h2>
                <img src="${imageUrl}" alt="${getDocumentTypeLabel(documentType)}" />
              </div>
              <script>
                window.print();
                window.onafterprint = function() { window.close(); };
              </script>
            </body>
          </html>
        `);
        printWindow.document.close();
        setPrintingDocId(null);
      }
    } catch (error) {
      toast.error('فشل طباعة الوثيقة');
    }
  };

  if (!isOpen || !employee) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-right">ملف الموظف - {employee.firstName} {employee.lastName}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Personal Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">المعلومات الشخصية</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">الاسم الأول</p>
                <p className="text-lg font-semibold text-gray-900 mt-1">{employee.firstName}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">اسم العائلة</p>
                <p className="text-lg font-semibold text-gray-900 mt-1">{employee.lastName}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">البريد الإلكتروني</p>
                <p className="text-lg font-semibold text-gray-900 mt-1">{employee.email}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">رقم الهاتف</p>
                <p className="text-lg font-semibold text-gray-900 mt-1">{employee.phone || '-'}</p>
              </div>
            </div>
          </div>

          {/* Job Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">معلومات الوظيفة</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">المسمى الوظيفي</p>
                <p className="text-lg font-semibold text-gray-900 mt-1">{employee.position || '-'}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">تاريخ المباشرة</p>
                <p className="text-lg font-semibold text-gray-900 mt-1">
                  {employee.hireDate ? new Date(employee.hireDate).toLocaleDateString('ar-LY') : '-'}
                </p>
              </div>
            </div>
          </div>

          {/* Documents Section */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">الوثائق والصور</h3>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="bg-indigo-600 hover:bg-indigo-700">
                    <Upload className="w-4 h-4 ml-2" />
                    رفع وثيقة
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-lg">
                  <DialogHeader>
                    <DialogTitle className="text-right">رفع وثيقة جديدة</DialogTitle>
                  </DialogHeader>

                  <form onSubmit={handleUpload} className="space-y-4">
                    {/* Document Type */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        نوع الوثيقة *
                      </label>
                      <Select value={documentType} onValueChange={setDocumentType}>
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

                    {/* Document Number */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        رقم الوثيقة
                      </label>
                      <Input
                        placeholder="رقم الوثيقة"
                        value={documentNumber}
                        onChange={(e) => setDocumentNumber(e.target.value)}
                      />
                    </div>

                    {/* Expiry Date */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        تاريخ الانتهاء
                      </label>
                      <Input
                        type="date"
                        value={expiryDate}
                        onChange={(e) => setExpiryDate(e.target.value)}
                      />
                    </div>

                    {/* Notes */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        ملاحظات
                      </label>
                      <Input
                        placeholder="ملاحظات إضافية"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                      />
                    </div>

                    {/* File Upload */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        الصورة *
                      </label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                        {previewUrl ? (
                          <div className="space-y-2">
                            <img src={previewUrl} alt="Preview" className="w-full h-40 object-cover rounded" />
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedFile(null);
                                setPreviewUrl(null);
                              }}
                            >
                              تغيير الصورة
                            </Button>
                          </div>
                        ) : (
                          <label className="cursor-pointer">
                            <div className="space-y-2">
                              <Upload className="w-8 h-8 text-gray-400 mx-auto" />
                              <p className="text-sm text-gray-600">اختر صورة أو اسحبها هنا</p>
                            </div>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleFileChange}
                              className="hidden"
                            />
                          </label>
                        )}
                      </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-3 pt-4">
                      <Button
                        type="submit"
                        className="flex-1 bg-indigo-600 hover:bg-indigo-700"
                        disabled={createDocumentMutation.isPending}
                      >
                        {createDocumentMutation.isPending ? 'جاري الرفع...' : 'رفع الوثيقة'}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          resetForm();
                        }}
                        className="flex-1"
                      >
                        إلغاء
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            {/* Documents Grid */}
            {documents.length === 0 ? (
              <div className="bg-gray-50 p-8 rounded-lg text-center">
                <p className="text-gray-600">لا توجد وثائق مرفوعة</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {documents.map((doc: any) => (
                  <Card key={doc.id} className="overflow-hidden">
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        {/* Document Image */}
                        <div className="relative group">
                          <img
                            src={doc.imageUrl}
                            alt={getDocumentTypeLabel(doc.documentType)}
                            className="w-full h-40 object-cover rounded-lg"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 rounded-lg flex items-center justify-center gap-2 transition-all opacity-0 group-hover:opacity-100">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-white hover:bg-white hover:text-black"
                              onClick={() => setSelectedImage(doc.imageUrl)}
                              title="عرض"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-white hover:bg-blue-600"
                              onClick={() => handleDownloadDocument(doc.imageUrl, doc.documentType, doc.documentNumber)}
                              title="تحميل"
                            >
                              <Download className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-white hover:bg-green-600"
                              onClick={() => handlePrintDocument(doc.imageUrl, doc.documentType)}
                              title="طباعة"
                            >
                              <Printer className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-white hover:bg-red-600"
                              onClick={() => {
                                if (confirm('هل أنت متأكد من حذف هذه الوثيقة؟')) {
                                  deleteDocumentMutation.mutate({ id: doc.id });
                                }
                              }}
                              title="حذف"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>

                        {/* Document Info */}
                        <div>
                          <p className="text-sm font-semibold text-gray-900">
                            {getDocumentTypeLabel(doc.documentType)}
                          </p>
                          {doc.documentNumber && (
                            <p className="text-xs text-gray-600 mt-1">
                              الرقم: {doc.documentNumber}
                            </p>
                          )}
                          {doc.expiryDate && (
                            <p className="text-xs text-gray-600">
                              ينتهي في: {new Date(doc.expiryDate).toLocaleDateString('ar-LY')}
                            </p>
                          )}
                          {doc.notes && (
                            <p className="text-xs text-gray-600 mt-1">
                              ملاحظات: {doc.notes}
                            </p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Image Preview Modal */}
          {selectedImage && (
            <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
              <div className="relative max-w-2xl w-full">
                <img src={selectedImage} alt="Preview" className="w-full rounded-lg" />
                <button
                  onClick={() => setSelectedImage(null)}
                  className="absolute top-4 right-4 bg-white rounded-full p-2 hover:bg-gray-100"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
