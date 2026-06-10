# 🚀 استنساخ وتشغيل CubesHR من GitHub

## 📥 الخطوة 1: استنساخ المستودع

### الطريقة 1: استخدام HTTPS (الأسهل)

```bash
# استنساخ المشروع
git clone https://github.com/abduelraheemhassan-sd/cubes-hr-platform.git

# الدخول إلى المجلد
cd cubes-hr-platform
```

### الطريقة 2: استخدام SSH (الأسرع)

```bash
# استنساخ المشروع باستخدام SSH
git clone git@github.com:abduelraheemhassan-sd/cubes-hr-platform.git

# الدخول إلى المجلد
cd cubes-hr-platform
```

---

## 🔧 الخطوة 2: اختر طريقة التشغيل

### ✅ الطريقة A: Docker (الموصى بها - الأسهل)

**المتطلبات:**
- Docker Desktop

**الخطوات:**

```bash
# 1. تأكد من تشغيل Docker Desktop

# 2. بناء وتشغيل الحاويات
docker-compose up -d

# 3. انتظر 30-60 ثانية لتشغيل قاعدة البيانات

# 4. تطبيق الهجرات (في نافذة جديدة)
docker-compose exec app pnpm db:push

# 5. افتح المتصفح
# http://localhost:3000
```

**المشاكل الشائعة:**

```bash
# إذا كان المنفذ 3000 مشغولاً
# عدّل docker-compose.yml:
# ports:
#   - "3001:3000"  # استخدم 3001 بدلاً من 3000

# إذا كانت حاوية MySQL بطيئة
docker-compose logs mysql

# إعادة تشغيل الخدمات
docker-compose restart

# إيقاف الخدمات
docker-compose down
```

---

### ✅ الطريقة B: التشغيل المحلي (الأسرع للتطوير)

**المتطلبات:**
- Node.js 18+ (تحميل من https://nodejs.org)
- pnpm (تثبيت: `npm install -g pnpm`)
- MySQL 8.0+ (تحميل من https://www.mysql.com/downloads/)

**الخطوات:**

#### 1. تثبيت المكتبات

```bash
# تثبيت pnpm (إذا لم يكن مثبتاً)
npm install -g pnpm

# تثبيت المكتبات
pnpm install
```

#### 2. إعداد قاعدة البيانات

```bash
# تشغيل MySQL (تأكد من تشغيل خادم MySQL)
# على Windows: ابدأ MySQL من Services
# على Mac: brew services start mysql
# على Linux: sudo systemctl start mysql

# إنشاء قاعدة البيانات والمستخدم
mysql -u root -p < setup.sql

# سيطلب كلمة المرور الخاصة بـ MySQL
# أدخل كلمة مرور root
```

#### 3. إنشاء ملف .env.local

```bash
# أنشئ ملف .env.local
cat > .env.local << 'EOF'
DATABASE_URL="mysql://cubes_user:cubes_password_123@localhost:3306/cubes_hr_db"
JWT_SECRET="your_jwt_secret_key_here_min_32_chars_for_security"
NODE_ENV="development"
PORT=3000
VITE_OAUTH_PORTAL_URL="http://localhost:3000"
VITE_APP_ID="local_app_id"
EOF
```

#### 4. تطبيق الهجرات

```bash
# تطبيق الهجرات على قاعدة البيانات
pnpm db:push
```

#### 5. تشغيل المشروع

```bash
# تشغيل الخادم والواجهة الأمامية
pnpm dev

# سيظهر:
# VITE v5.x.x  ready in xxx ms
# ➜  Local:   http://localhost:3000
```

#### 6. فتح المتصفح

```
افتح http://localhost:3000 في متصفحك
```

---

## 🔑 بيانات الدخول الافتراضية

### حساب المدير (Admin)
```
البريد الإلكتروني: admin@cubeshr.com
كلمة المرور: admin123
```

### حساب مدير الموارد البشرية (HR Manager)
```
البريد الإلكتروني: hr@cubeshr.com
كلمة المرور: hr123
```

### حساب موظف عادي (Employee)
```
البريد الإلكتروني: employee@cubeshr.com
كلمة المرور: emp123
```

---

## 🎯 الخطوات الأولى بعد التشغيل

### 1. تسجيل الدخول
```
1. افتح http://localhost:3000
2. انقر على "تسجيل الدخول"
3. استخدم بيانات المدير أعلاه
4. انقر على "دخول"
```

### 2. استكشاف الميزات
```
من القائمة الجانبية:
- الموظفين: إضافة وإدارة الموظفين
- الحضور: تسجيل الحضور والغياب
- الموافقات: إنشاء وإدارة طلبات الموافقات
- التقارير: عرض التقارير والإحصائيات
- الإعدادات: إدارة النظام
```

### 3. إضافة موظف جديد
```
1. من القائمة، انقر على "الموظفين"
2. انقر على "إضافة موظف جديد"
3. أدخل البيانات:
   - الاسم: أحمد محمد
   - البريد: ahmed@example.com
   - الرقم الوظيفي: EMP001
   - المسمى: مهندس برمجيات
4. انقر على "حفظ"
```

---

## 🔍 التحقق من التثبيت

### التحقق من Node.js و pnpm

```bash
# التحقق من Node.js
node --version
# يجب أن يكون 18 أو أعلى

# التحقق من pnpm
pnpm --version
```

### التحقق من MySQL

```bash
# التحقق من MySQL
mysql --version

# اختبار الاتصال
mysql -u cubes_user -p cubes_hr_db
# أدخل كلمة المرور: cubes_password_123

# إذا دخلت بنجاح، اكتب:
exit
```

### التحقق من المشروع

```bash
# تشغيل الاختبارات
pnpm test

# يجب أن تمر جميع الاختبارات

# تنسيق الكود
pnpm format

# التحقق من الأخطاء
pnpm lint
```

---

## 🆘 استكشاف الأخطاء الشائعة

### المشكلة 1: "Port 3000 already in use"

**الحل:**
```bash
# استخدم منفذ مختلف
PORT=3001 pnpm dev

# أو غير المنفذ في docker-compose.yml
```

### المشكلة 2: "Cannot connect to database"

**الحل:**
```bash
# تحقق من تشغيل MySQL
mysql -u root -p

# تحقق من بيانات الاتصال في .env.local
cat .env.local | grep DATABASE_URL

# أعد تشغيل MySQL
# على Windows: Services → MySQL → Restart
# على Mac: brew services restart mysql
# على Linux: sudo systemctl restart mysql

# أعد تطبيق الهجرات
pnpm db:push
```

### المشكلة 3: "Module not found"

**الحل:**
```bash
# أعد تثبيت المكتبات
rm -rf node_modules pnpm-lock.yaml
pnpm install

# أعد تشغيل المشروع
pnpm dev
```

### المشكلة 4: "pnpm: command not found"

**الحل:**
```bash
# تثبيت pnpm
npm install -g pnpm

# تحقق من التثبيت
pnpm --version
```

### المشكلة 5: "Git command not found"

**الحل:**
```bash
# تثبيت Git
# على Windows: https://git-scm.com/download/win
# على Mac: brew install git
# على Linux: sudo apt-get install git

# تحقق من التثبيت
git --version
```

---

## 📊 أوامر مفيدة

### التطوير

```bash
# تشغيل المشروع
pnpm dev

# تشغيل الاختبارات
pnpm test

# تشغيل الاختبارات مع المراقبة
pnpm test:watch

# تنسيق الكود
pnpm format

# التحقق من الأخطاء
pnpm lint

# بناء المشروع
pnpm build
```

### إدارة قاعدة البيانات

```bash
# تطبيق الهجرات
pnpm db:push

# عرض قاعدة البيانات
pnpm db:studio

# إنشاء هجرة جديدة
pnpm db:generate
```

### Docker

```bash
# بناء الحاويات
docker-compose build

# تشغيل الحاويات
docker-compose up -d

# إيقاف الحاويات
docker-compose down

# عرض السجلات
docker-compose logs -f

# تشغيل أمر في الحاوية
docker-compose exec app pnpm test
```

---

## 📚 الملفات المساعدة

| الملف | الوصف |
|------|-------|
| `README.md` | دليل المشروع الرئيسي |
| `QUICK_START.md` | بدء سريع (5 دقائق) |
| `LOCAL_SETUP.md` | دليل التثبيت المحلي المفصل |
| `DOCKER_SETUP.md` | دليل Docker المفصل |
| `USER_GUIDE.md` | دليل المستخدم الشامل |
| `GITHUB_DEPLOYMENT.md` | دليل الرفع على GitHub |
| `GITHUB_QUICK_COMMANDS.md` | أوامر GitHub السريعة |

---

## ✅ قائمة التحقق

- [ ] استنساخ المشروع من GitHub
- [ ] تثبيت Node.js و pnpm
- [ ] تثبيت MySQL
- [ ] تثبيت المكتبات (`pnpm install`)
- [ ] إنشاء قاعدة البيانات (`mysql < setup.sql`)
- [ ] إنشاء ملف `.env.local`
- [ ] تطبيق الهجرات (`pnpm db:push`)
- [ ] تشغيل المشروع (`pnpm dev`)
- [ ] فتح http://localhost:3000
- [ ] تسجيل الدخول بنجاح
- [ ] استكشاف الميزات الأساسية

---

## 🎉 تم!

المشروع جاهز للتشغيل! استمتع بـ CubesHR 🚀

**للمساعدة:**
- اقرأ الملفات المساعدة أعلاه
- تحقق من الأخطاء الشائعة
- تواصل مع الدعم: support@cubeshr.com
