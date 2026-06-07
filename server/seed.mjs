import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';

const DATABASE_URL = process.env.DATABASE_URL;

async function seed() {
  if (!DATABASE_URL) {
    console.error('DATABASE_URL is not set');
    process.exit(1);
  }

  const connection = await mysql.createConnection(DATABASE_URL);
  const db = drizzle(connection);

  try {
    console.log('🌱 بدء إضافة البيانات التجريبية...');

    // Add departments
    const departmentQuery = `
      INSERT IGNORE INTO departments (name, description) VALUES 
      ('الموارد البشرية', 'قسم إدارة الموارد البشرية'),
      ('تكنولوجيا المعلومات', 'قسم تكنولوجيا المعلومات والأنظمة'),
      ('المبيعات', 'قسم المبيعات والتسويق'),
      ('العمليات', 'قسم العمليات والإنتاج'),
      ('المالية', 'قسم المالية والمحاسبة')
    `;
    
    await connection.execute(departmentQuery);
    console.log('✓ تم إضافة الأقسام');

    // Add roles
    const roleQuery = `
      INSERT IGNORE INTO roles (name, description) VALUES 
      ('مسؤول', 'مسؤول النظام'),
      ('مدير HR', 'مدير الموارد البشرية'),
      ('موظف', 'موظف عادي'),
      ('مدير', 'مدير القسم')
    `;
    
    await connection.execute(roleQuery);
    console.log('✓ تم إضافة الأدوار');

    // Add employees
    const employeeQuery = `
      INSERT IGNORE INTO employees (firstName, lastName, email, phone, nationalId, departmentId, position, salary, hireDate, status) VALUES 
      ('أحمد', 'محمد', 'ahmed@company.com', '0501234567', '1234567890', 1, 'مدير HR', '8000', '2023-01-15', 'active'),
      ('فاطمة', 'علي', 'fatima@company.com', '0502345678', '1234567891', 2, 'مهندس برمجيات', '6500', '2023-02-20', 'active'),
      ('محمود', 'حسن', 'mahmoud@company.com', '0503456789', '1234567892', 3, 'مدير مبيعات', '7000', '2023-03-10', 'active'),
      ('نور', 'سارة', 'noor@company.com', '0504567890', '1234567893', 4, 'مشرف إنتاج', '5500', '2023-04-05', 'active'),
      ('خالد', 'إبراهيم', 'khaled@company.com', '0505678901', '1234567894', 5, 'محاسب', '5000', '2023-05-12', 'active'),
      ('ليلى', 'محمود', 'layla@company.com', '0506789012', '1234567895', 1, 'موظف HR', '4000', '2023-06-01', 'active'),
      ('عمر', 'ياسين', 'omar@company.com', '0507890123', '1234567896', 2, 'مهندس QA', '5500', '2023-07-15', 'active'),
      ('مريم', 'علي', 'mariam@company.com', '0508901234', '1234567897', 3, 'مندوب مبيعات', '4500', '2023-08-20', 'active'),
      ('حسين', 'أحمد', 'hussein@company.com', '0509012345', '1234567898', 4, 'عامل إنتاج', '3500', '2023-09-10', 'active'),
      ('رانيا', 'محمد', 'rania@company.com', '0510123456', '1234567899', 5, 'موظف مالية', '4200', '2023-10-05', 'active')
    `;
    
    await connection.execute(employeeQuery);
    console.log('✓ تم إضافة الموظفين');

    // Add contracts
    const contractQuery = `
      INSERT IGNORE INTO contracts (employeeId, contractType, startDate, endDate, status) VALUES 
      (1, 'permanent', '2023-01-15', NULL, 'active'),
      (2, 'permanent', '2023-02-20', NULL, 'active'),
      (3, 'permanent', '2023-03-10', NULL, 'active'),
      (4, 'permanent', '2023-04-05', NULL, 'active'),
      (5, 'permanent', '2023-05-12', NULL, 'active'),
      (6, 'contract', '2023-06-01', '2024-06-01', 'active'),
      (7, 'permanent', '2023-07-15', NULL, 'active'),
      (8, 'contract', '2023-08-20', '2024-08-20', 'active'),
      (9, 'permanent', '2023-09-10', NULL, 'active'),
      (10, 'contract', '2023-10-05', '2024-10-05', 'active')
    `;
    
    await connection.execute(contractQuery);
    console.log('✓ تم إضافة العقود');

    // Add attendance records
    const today = new Date().toISOString().split('T')[0];
    const attendanceQuery = `
      INSERT IGNORE INTO attendance (employeeId, date, checkInTime, checkOutTime, status) VALUES 
      (1, '${today}', '08:00:00', '17:00:00', 'present'),
      (2, '${today}', '08:15:00', '17:15:00', 'present'),
      (3, '${today}', '08:30:00', NULL, 'present'),
      (4, '${today}', NULL, NULL, 'absent'),
      (5, '${today}', '08:00:00', '17:00:00', 'present'),
      (6, '${today}', '09:00:00', '17:30:00', 'late'),
      (7, '${today}', '08:00:00', '17:00:00', 'present'),
      (8, '${today}', NULL, NULL, 'leave'),
      (9, '${today}', '08:00:00', '16:00:00', 'present'),
      (10, '${today}', '08:00:00', '17:00:00', 'present')
    `;
    
    await connection.execute(attendanceQuery);
    console.log('✓ تم إضافة سجلات الحضور');

    console.log('✅ تم إضافة البيانات التجريبية بنجاح!');
  } catch (error) {
    console.error('❌ خطأ أثناء إضافة البيانات:', error);
    process.exit(1);
  } finally {
    await connection.end();
  }
}

seed();
