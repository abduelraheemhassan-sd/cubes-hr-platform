# دليل التثبيت والتشغيل المحلي - منصة CubesHR

## 📋 المتطلبات الأساسية

قبل البدء، تأكد من تثبيت المتطلبات التالية على جهازك:

### متطلبات النظام
- **نظام التشغيل**: Windows 10+, macOS 10.14+, أو Linux (Ubuntu 18.04+)
- **المتصفح**: Chrome, Firefox, Safari, أو Edge (الإصدارات الحديثة)
- **مساحة التخزين**: 2 GB على الأقل

### البرامج المطلوبة
- **Node.js**: الإصدار 18.0.0 أو أحدث
  - التحميل من: https://nodejs.org/
  - التحقق: `node --version`

- **pnpm**: مدير الحزم (بديل npm أسرع)
  - التثبيت: `npm install -g pnpm`
  - التحقق: `pnpm --version`

- **Git**: نظام التحكم بالإصدارات
  - التحميل من: https://git-scm.com/
  - التحقق: `git --version`

- **MySQL** أو **MariaDB**: قاعدة البيانات
  - التحميل من: https://dev.mysql.com/downloads/
  - التحقق: `mysql --version`

---

## 🚀 خطوات التثبيت والتشغيل

### الخطوة 1: استنساخ المشروع

```bash
# استنساخ المشروع من Git
git clone https://github.com/your-org/cubes-hr-platform.git

# الدخول إلى مجلد المشروع
cd cubes-hr-platform
```

### الخطوة 2: تثبيت المتطلبات

```bash
# تثبيت جميع المكتبات المطلوبة
pnpm install

# أو إذا كنت تستخدم npm
npm install
```

**ملاحظة**: قد يستغرق التثبيت 5-10 دقائق حسب سرعة الإنترنت.

### الخطوة 3: إعداد قاعدة البيانات

#### أ) إنشاء قاعدة بيانات MySQL

```bash
# الدخول إلى MySQL
mysql -u root -p

# إنشاء قاعدة بيانات جديدة
CREATE DATABASE cubes_hr_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# إنشاء مستخدم جديد
CREATE USER 'cubes_user'@'localhost' IDENTIFIED BY 'secure_password_123';

# منح الصلاحيات
GRANT ALL PRIVILEGES ON cubes_hr_db.* TO 'cubes_user'@'localhost';
FLUSH PRIVILEGES;

# الخروج
EXIT;
```

#### ب) إعداد متغيرات البيئة

أنشئ ملف `.env.local` في جذر المشروع:

```bash
# قاعدة البيانات
DATABASE_URL="mysql://cubes_user:secure_password_123@localhost:3306/cubes_hr_db"

# المفاتيح السرية
JWT_SECRET="your_jwt_secret_key_here_min_32_chars"

# OAuth (اختياري للتطوير المحلي)
VITE_OAUTH_PORTAL_URL="http://localhost:3000"
VITE_APP_ID="your_app_id"

# المنفذ
PORT=3000
```

#### ج) تطبيق الهجرات

```bash
# إنشاء جداول قاعدة البيانات
pnpm db:push
```

### الخطوة 4: تشغيل المشروع

```bash
# تشغيل خادم التطوير
pnpm dev
```

**الإخراج المتوقع:**
```
  ➜  Local:   http://localhost:3000/
  ➜  press h to show help
```

### الخطوة 5: فتح المتصفح

افتح متصفحك وانتقل إلى:
```
http://localhost:3000
```

---

## 🔐 التسجيل والدخول

### التسجيل الأول

1. انقر على زر "تسجيل جديد" أو "Sign Up"
2. أدخل بيانات حسابك:
   - البريد الإلكتروني
   - كلمة المرور
   - اسم الشركة
3. انقر على "إنشاء حساب"

### الدخول

1. انقر على "تسجيل الدخول"
2. أدخل بيانات اعتمادك
3. انقر على "دخول"

### تفعيل صلاحيات المدير

لتفعيل صلاحيات المدير (Admin)، قم بتشغيل الأمر التالي:

```bash
# الدخول إلى MySQL
mysql -u cubes_user -p cubes_hr_db

# تحديث دور المستخدم
UPDATE users SET role = 'admin' WHERE email = 'your_email@example.com';

# الخروج
EXIT;
```

---

## 📱 الميزات الرئيسية

### 1. إدارة الموظفين
- إضافة وتعديل وحذف الموظفين
- إدارة بيانات الموظف الشاملة
- تتبع حالة الموظف

### 2. إدارة الحضور والغياب
- تسجيل الحضور اليومي
- تتبع الغياب والتأخر
- تقارير الحضور

### 3. إدارة الرواتب
- حساب الرواتب والمستحقات
- إدارة الخصومات والإضافات
- إنشاء كشوفات الرواتب

### 4. إدارة الموافقات
- إنشاء طلبات موافقة
- الموافقة أو الرفض من قبل المديرين
- تتبع حالة الطلبات

### 5. التقارير والتحليلات
- تقارير الموظفين
- تحليلات الأداء
- إحصائيات الشركة

---

## 🛠️ الأوامر المفيدة

### تطوير المشروع

```bash
# تشغيل خادم التطوير
pnpm dev

# بناء المشروع للإنتاج
pnpm build

# تشغيل الاختبارات
pnpm test

# تنسيق الكود
pnpm format

# التحقق من الأخطاء
pnpm lint
```

### إدارة قاعدة البيانات

```bash
# إنشاء هجرة جديدة
pnpm db:generate

# تطبيق الهجرات
pnpm db:push

# فتح واجهة Drizzle Studio
pnpm db:studio
```

---

## 🐛 استكشاف الأخطاء الشائعة

### المشكلة 1: خطأ "Port 3000 already in use"

**الحل:**
```bash
# استخدم منفذ مختلف
PORT=3001 pnpm dev

# أو أغلق التطبيق الذي يستخدم المنفذ 3000
# على Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# على macOS/Linux:
lsof -i :3000
kill -9 <PID>
```

### المشكلة 2: خطأ "Cannot connect to database"

**الحل:**
1. تأكد من تشغيل MySQL
2. تحقق من بيانات الاتصال في `.env.local`
3. تأكد من وجود قاعدة البيانات

```bash
# اختبر الاتصال
mysql -u cubes_user -p -h localhost cubes_hr_db
```

### المشكلة 3: خطأ "Module not found"

**الحل:**
```bash
# أعد تثبيت المكتبات
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### المشكلة 4: الصفحة لا تحمل

**الحل:**
1. امسح ذاكرة التخزين المؤقت: `Ctrl+Shift+Delete`
2. أعد تحميل الصفحة: `Ctrl+R` أو `Cmd+R`
3. افتح أدوات المطور: `F12` وتحقق من الأخطاء

### المشكلة 5: خطأ "CORS" أو "Access denied"

**الحل:**
تأكد من أن الخادم يسمح بالطلبات من `localhost:3000`:

```bash
# في ملف .env.local
CORS_ORIGIN="http://localhost:3000"
```

---

## 📊 واجهة الإدارة

### الوصول إلى لوحة التحكم

بعد تسجيل الدخول، ستجد في الشريط الجانبي:

- **لوحة التحكم**: ملخص إحصائيات الشركة
- **الموظفين**: إدارة بيانات الموظفين
- **الحضور**: تسجيل الحضور والغياب
- **الرواتب**: إدارة الرواتب والمستحقات
- **الموافقات**: إدارة طلبات الموافقة
- **التقارير**: عرض التقارير والإحصائيات
- **الإعدادات**: تخصيص النظام

---

## 🔄 التطوير والاختبار

### كتابة الاختبارات

```bash
# تشغيل الاختبارات
pnpm test

# تشغيل اختبار محدد
pnpm test server/employees.test.ts

# مراقبة الاختبارات (تحديث تلقائي)
pnpm test --watch
```

### إضافة ميزة جديدة

1. أنشئ جدول جديد في `drizzle/schema.ts`
2. أنشئ دوال مساعدة في `server/db.ts`
3. أنشئ إجراء tRPC في `server/routers.ts`
4. أنشئ مكون واجهة في `client/src/pages/`
5. اكتب اختبارات في `server/*.test.ts`

---

## 📚 الموارد الإضافية

### التوثيق الرسمي
- **React**: https://react.dev/
- **tRPC**: https://trpc.io/
- **Tailwind CSS**: https://tailwindcss.com/
- **Drizzle ORM**: https://orm.drizzle.team/

### مشاريع مشابهة
- **Plane**: https://plane.so/
- **Supabase**: https://supabase.com/
- **Retool**: https://retool.com/

### المساعدة والدعم
- **البريد الإلكتروني**: support@cubeshr.com
- **الدردشة المباشرة**: https://cubeshr.com/chat
- **المنتدى**: https://community.cubeshr.com/

---

## ✅ قائمة التحقق النهائية

قبل الإطلاق، تأكد من:

- [ ] تثبيت Node.js و pnpm
- [ ] استنساخ المشروع بنجاح
- [ ] تثبيت المكتبات بنجاح
- [ ] إنشاء قاعدة البيانات
- [ ] إعداد ملف `.env.local`
- [ ] تطبيق الهجرات
- [ ] تشغيل الخادم بنجاح
- [ ] فتح المتصفح على `http://localhost:3000`
- [ ] التسجيل وإنشاء حساب
- [ ] اختبار الميزات الأساسية
- [ ] تشغيل الاختبارات بنجاح

---

## 🎉 تم!

تهانينا! لقد قمت بتثبيت وتشغيل منصة CubesHR بنجاح على خادم محلي.

للمزيد من المعلومات، راجع:
- `USER_GUIDE.md` - دليل المستخدم الشامل
- `LAUNCH_REQUIREMENTS.md` - متطلبات الإطلاق
- `LAUNCH_STEPS.md` - خطوات الإطلاق الرسمي

**استمتع باستخدام CubesHR!** 🚀
