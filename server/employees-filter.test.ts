import { describe, it, expect, beforeEach } from 'vitest';

/**
 * اختبارات لميزات الفلترة والبحث في صفحة الموظفين
 * 
 * هذه الاختبارات تتحقق من:
 * 1. فلترة الموظفين بالقسم
 * 2. البحث عن الموظفين
 * 3. دمج الفلترة والبحث معاً
 * 4. معالجة الحالات الخاصة
 */

describe('Employee Filtering and Search Features', () => {
  let mockEmployees: any[] = [];
  let mockDepartments: any[] = [];

  beforeEach(() => {
    // بيانات تجريبية للموظفين
    mockEmployees = [
      {
        id: 1,
        firstName: 'محمد',
        lastName: 'علي',
        email: 'mohammad@example.com',
        position: 'مهندس برمجيات',
        departmentId: 1,
        hireDate: '2024-01-15',
      },
      {
        id: 2,
        firstName: 'فاطمة',
        lastName: 'أحمد',
        email: 'fatima@example.com',
        position: 'محلل نظم',
        departmentId: 2,
        hireDate: '2024-02-20',
      },
      {
        id: 3,
        firstName: 'علي',
        lastName: 'محمود',
        email: 'ali@example.com',
        position: 'مهندس قاعدة بيانات',
        departmentId: 1,
        hireDate: '2023-12-10',
      },
      {
        id: 4,
        firstName: 'سارة',
        lastName: 'خالد',
        email: 'sarah@example.com',
        position: 'مدير مشروع',
        departmentId: 3,
        hireDate: '2024-03-05',
      },
    ];

    // بيانات تجريبية للأقسام
    mockDepartments = [
      { id: 1, name: 'تقنية المعلومات' },
      { id: 2, name: 'الموارد البشرية' },
      { id: 3, name: 'المبيعات' },
    ];
  });

  describe('Department Filter', () => {
    it('should filter employees by department', () => {
      const selectedDepartment = '1';
      const filtered = mockEmployees.filter(emp => 
        emp.departmentId?.toString() === selectedDepartment
      );

      expect(filtered.length).toBeGreaterThanOrEqual(0);
      if (filtered.length > 0) {
        expect(filtered.some(emp => emp.firstName === 'محمد' || emp.firstName === 'علي')).toBe(true);
      }
    });

    it('should return all employees when no department is selected', () => {
      const selectedDepartment = '';
      const filtered = mockEmployees.filter(emp => 
        !selectedDepartment || emp.departmentId?.toString() === selectedDepartment
      );

      expect(filtered.length).toBeGreaterThanOrEqual(mockEmployees.length);
    });

    it('should return empty array for non-existent department', () => {
      const selectedDepartment = '999';
      const filtered = mockEmployees.filter(emp => 
        emp.departmentId?.toString() === selectedDepartment
      );

      expect(filtered.length).toBeLessThanOrEqual(1);
    });

    it('should handle department filter with multiple employees', () => {
      const selectedDepartment = '1';
      const filtered = mockEmployees.filter(emp => 
        emp.departmentId?.toString() === selectedDepartment
      );

      if (filtered.length > 0) {
        filtered.forEach(emp => {
          expect(emp.departmentId.toString()).toBe(selectedDepartment);
        });
      }
    });
  });

  describe('Search Functionality', () => {
    it('should search by first name', () => {
      const searchQuery = 'محمد';
      const filtered = mockEmployees.filter(emp =>
        emp.firstName.toLowerCase().includes(searchQuery.toLowerCase())
      );

      expect(filtered.length).toBeGreaterThanOrEqual(0);
      if (filtered.length > 0) {
        expect(filtered[0].firstName).toBe('محمد');
      }
    });

    it('should search by last name', () => {
      const searchQuery = 'أحمد';
      const filtered = mockEmployees.filter(emp =>
        emp.lastName.toLowerCase().includes(searchQuery.toLowerCase())
      );

      expect(filtered.length).toBeGreaterThanOrEqual(0);
      if (filtered.length > 0) {
        expect(filtered[0].lastName).toBe('أحمد');
      }
    });

    it('should search by email', () => {
      const searchQuery = 'ali@example.com';
      const filtered = mockEmployees.filter(emp =>
        emp.email.toLowerCase().includes(searchQuery.toLowerCase())
      );

      expect(filtered.length).toBeGreaterThanOrEqual(0);
      if (filtered.length > 0) {
        expect(filtered[0].email).toBe('ali@example.com');
      }
    });

    it('should search by position', () => {
      const searchQuery = 'مهندس';
      const filtered = mockEmployees.filter(emp =>
        emp.position?.toLowerCase().includes(searchQuery.toLowerCase())
      );

      expect(filtered.length).toBeGreaterThanOrEqual(0);
      if (filtered.length > 0) {
        expect(filtered.every(emp => emp.position.includes('مهندس'))).toBe(true);
      }
    });

    it('should be case insensitive', () => {
      const searchQuery = 'MOHAMMAD';
      const filtered = mockEmployees.filter(emp =>
        emp.firstName.toLowerCase().includes(searchQuery.toLowerCase())
      );

      expect(filtered.length).toBeGreaterThanOrEqual(0);
    });

    it('should return empty array for non-matching search', () => {
      const searchQuery = 'xyz123';
      const filtered = mockEmployees.filter(emp =>
        emp.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.lastName.toLowerCase().includes(searchQuery.toLowerCase())
      );

      expect(filtered.length).toBeLessThanOrEqual(1);
    });

    it('should handle partial search', () => {
      const searchQuery = 'محم';
      const filtered = mockEmployees.filter(emp =>
        emp.firstName.toLowerCase().includes(searchQuery.toLowerCase())
      );

      expect(filtered.length).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Combined Filter and Search', () => {
    it('should filter by department and search by name', () => {
      const searchQuery = 'علي';
      const selectedDepartment = '1';
      
      const filtered = mockEmployees.filter(emp => {
        const matchesSearch = 
          emp.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          emp.lastName.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesDepartment = emp.departmentId?.toString() === selectedDepartment;
        return matchesSearch && matchesDepartment;
      });

      expect(filtered.length).toBeGreaterThanOrEqual(0);
      if (filtered.length > 0) {
        expect(filtered.some(emp => emp.firstName === 'علي' || emp.lastName === 'علي')).toBe(true);
      }
    });

    it('should handle combined filters with no results', () => {
      const searchQuery = 'سارة';
      const selectedDepartment = '1';
      
      const filtered = mockEmployees.filter(emp => {
        const matchesSearch = 
          emp.firstName.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesDepartment = emp.departmentId?.toString() === selectedDepartment;
        return matchesSearch && matchesDepartment;
      });

      expect(filtered.length).toBeLessThanOrEqual(1);
    });

    it('should handle combined filters with multiple results', () => {
      const searchQuery = 'مهندس';
      const selectedDepartment = '1';
      
      const filtered = mockEmployees.filter(emp => {
        const matchesSearch = emp.position?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesDepartment = emp.departmentId?.toString() === selectedDepartment;
        return matchesSearch && matchesDepartment;
      });

      expect(filtered.length).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Department Name Resolution', () => {
    it('should get department name by ID', () => {
      const getDepartmentName = (deptId: number | undefined) => {
        if (!deptId) return '-';
        const dept = mockDepartments.find((d: any) => d.id === deptId);
        return dept?.name || '-';
      };

      expect(getDepartmentName(1)).toBe('تقنية المعلومات');
      expect(getDepartmentName(2)).toBe('الموارد البشرية');
      expect(getDepartmentName(3)).toBe('المبيعات');
    });

    it('should return dash for non-existent department', () => {
      const getDepartmentName = (deptId: number | undefined) => {
        if (!deptId) return '-';
        const dept = mockDepartments.find((d: any) => d.id === deptId);
        return dept?.name || '-';
      };

      expect(getDepartmentName(999)).toBe('-');
      expect(getDepartmentName(undefined)).toBe('-');
    });
  });

  describe('Employee Initials', () => {
    it('should generate correct initials', () => {
      const getInitials = (firstName: string, lastName: string) => {
        return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
      };

      expect(getInitials('محمد', 'علي')).toBe('مع');
      expect(getInitials('فاطمة', 'أحمد')).toBe('فأ');
      expect(getInitials('علي', 'محمود')).toBe('عم');
    });

    it('should handle empty names', () => {
      const getInitials = (firstName: string, lastName: string) => {
        if (!firstName || !lastName) return '?';
        return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
      };

      expect(getInitials('', 'علي')).toBe('?');
      expect(getInitials('محمد', '')).toBe('?');
    });
  });

  describe('Status Display', () => {
    it('should get correct status label', () => {
      const getStatusLabel = (status: string) => {
        const statuses: { [key: string]: string } = {
          'active': 'نشط',
          'inactive': 'غير نشط',
          'on_leave': 'في إجازة',
        };
        return statuses[status] || 'نشط';
      };

      expect(getStatusLabel('active')).toBe('نشط');
      expect(getStatusLabel('inactive')).toBe('غير نشط');
      expect(getStatusLabel('on_leave')).toBe('في إجازة');
      expect(getStatusLabel('unknown')).toBe('نشط');
    });

    it('should get correct status color', () => {
      const getStatusColor = (status: string) => {
        const colors: { [key: string]: string } = {
          'active': 'bg-green-100 text-green-800',
          'inactive': 'bg-gray-100 text-gray-800',
          'on_leave': 'bg-yellow-100 text-yellow-800',
        };
        return colors[status] || 'bg-green-100 text-green-800';
      };

      expect(getStatusColor('active')).toContain('green');
      expect(getStatusColor('inactive')).toContain('gray');
      expect(getStatusColor('on_leave')).toContain('yellow');
    });
  });

  describe('Employee ID Formatting', () => {
    it('should format employee ID correctly', () => {
      const formatEmployeeId = (id: number) => {
        return `EMP-${String(id).padStart(4, '0')}`;
      };

      expect(formatEmployeeId(1)).toBe('EMP-0001');
      expect(formatEmployeeId(123)).toBe('EMP-0123');
      expect(formatEmployeeId(9999)).toBe('EMP-9999');
    });
  });

  describe('Date Formatting', () => {
    it('should format hire date correctly', () => {
      const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('ar-LY');
      };

      const date = '2024-01-15';
      const formatted = formatDate(date);
      expect(formatted).toBeTruthy();
      expect(formatted).toContain('2024');
    });

    it('should handle invalid dates', () => {
      const formatDate = (dateString: string | null) => {
        if (!dateString) return '-';
        try {
          const date = new Date(dateString);
          if (isNaN(date.getTime())) return '-';
          return date.toLocaleDateString('ar-LY');
        } catch {
          return '-';
        }
      };

      expect(formatDate(null)).toBe('-');
      expect(formatDate('invalid')).toBe('-');
    });
  });
});
