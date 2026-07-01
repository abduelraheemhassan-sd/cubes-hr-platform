# 🖥️ شرح مفصل: التشغيل المحلي (الطريقة B)

هذا الدليل يشرح كل خطوة بالتفصيل لتشغيل CubesHR محلياً على جهازك.

---

## 📋 المتطلبات الأساسية

قبل البدء، تأكد من تثبيت:

### 1. Git
**ما هو؟** - برنامج لإدارة الإصدارات والتحكم بالكود

**التحميل:**
- **Windows**: https://git-scm.com/download/win
- **Mac**: `brew install git`
- **Linux**: `sudo apt-get install git`

**التحقق:**
```bash
git --version
# يجب أن يظهر: git version 2.x.x
```

---

### 2. Node.js و npm
**ما هو؟** - بيئة تشغيل JavaScript وإدارة المكتبات

**التحميل:**
- اذهب إلى https://nodejs.org
- اختر **LTS** (الإصدار المستقر)
- اتبع التعليمات

**التحقق:**
```bash
node --version
# يجب أن يكون 18 أو أعلى (v18.0.0 أو أكثر)

npm --version
# يجب أن يكون 9 أو أعلى
```

---

### 3. pnpm
**ما هو؟** - مدير مكتبات أسرع من npm

**التثبيت:**
```bash
# الطريقة 1: باستخدام npm
npm install -g pnpm

# الطريقة 2: باستخدام Homebrew (Mac فقط)
brew install pnpm

# الطريقة 3: باستخدام Chocolatey (Windows فقط)
choco install pnpm
```

**التحقق:**
```bash
pnpm --version
# يجب أن يظهر: 8.x.x أو أعلى
```

---

### 4. MySQL 8.0+
**ما هو؟** - قاعدة بيانات لتخزين البيانات

**التحميل:**
- اذهب إلى https://www.mysql.com/downloads/
- اختر **MySQL Community Server**
- اختر إصدارك (Windows, Mac, Linux)
- اتبع التعليمات

**التحقق:**
```bash
mysql --version
# يجب أن يظهر: mysql Ver 8.0.x
```

**تشغيل MySQL:**
- **Windows**: ابدأ MySQL من Services أو Command Line
- **Mac**: `brew services start mysql`
- **Linux**: `sudo systemctl start mysql`

---

## 🚀 الخطوات المفصلة

### الخطوة 1: استنساخ المشروع

**ما الذي سنفعله؟** - نسخ كود المشروع من GitHub إلى جهازك

```bash
# افتح Terminal أو Command Prompt

# اختر مكان لحفظ المشروع (اختياري)
cd ~/Projects  # أو أي مجلد تفضله

# استنساخ المشروع
git clone https://github.com/abduelraheemhassan-sd/cubes-hr-platform.git

# الدخول إلى مجلد المشروع
cd cubes-hr-platform

# عرض محتويات المجلد
ls -la
# يجب أن ترى:
# - client/
# - server/
# - drizzle/
# - package.json
# - docker-compose.yml
# - وملفات أخرى
```

**ماذا حدث؟**
- تم تحميل كل ملفات المشروع من GitHub
- أنت الآن في مجلد المشروع

---

### الخطوة 2: تثبيت المكتبات

**ما الذي سنفعله؟** - تثبيت جميع المكتبات التي يحتاجها المشروع

```bash
# تأكد أنك في مجلد المشروع
pwd
# يجب أن يظهر: /path/to/cubes-hr-platform

# تثبيت المكتبات باستخدام pnpm
pnpm install

# هذا سيستغرق 2-5 دقائق
# ستظهر رسائل مثل:
# - Fetching packages...
# - Linking packages...
# - Done!
```

**ماذا حدث؟**
- تم تثبيت جميع المكتبات المطلوبة
- تم إنشاء مجلد `node_modules/` (كبير جداً، لا تقلق)
- تم إنشاء ملف `pnpm-lock.yaml` (لا تعدله)

**المشاكل الشائعة:**
```bash
# إذا حصلت على خطأ "pnpm: command not found"
npm install -g pnpm

# إذا حصلت على خطأ "permission denied"
# على Mac/Linux: استخدم sudo
sudo pnpm install
```

---

### الخطوة 3: إنشاء قاعدة البيانات

**ما الذي سنفعله؟** - إنشاء قاعدة بيانات MySQL وجداولها

#### 3.1: تشغيل MySQL

```bash
# تأكد من تشغيل MySQL
# على Windows:
# - ابدأ MySQL من Services
# - أو اكتب في Command Prompt: mysql.server start

# على Mac:
brew services start mysql

# على Linux:
sudo systemctl start mysql
```

#### 3.2: إنشاء قاعدة البيانات

```bash
# من مجلد المشروع، شغل ملف setup.sql
mysql -u root -p < setup.sql

# سيطلب كلمة المرور
# أدخل كلمة مرور MySQL الخاصة بك (التي وضعتها عند التثبيت)
# إذا لم تضع كلمة مرور، اضغط Enter

# إذا نجحت، لن تظهر رسائل خطأ
```

**ماذا حدث؟**
- تم إنشاء قاعدة بيانات باسم `cubes_hr_db`
- تم إنشاء مستخدم باسم `cubes_user`
- تم إنشاء جداول قاعدة البيانات الأساسية

#### 3.3: التحقق من إنشاء قاعدة البيانات

```bash
# اتصل بـ MySQL
mysql -u cubes_user -p cubes_hr_db

# أدخل كلمة المرور: cubes_password_123

# إذا دخلت بنجاح، اكتب:
show tables;

# يجب أن ترى جداول مثل:
# - users
# - employees
# - attendance
# - approvals
# - audit_logs

# للخروج:
exit
```

---

### الخطوة 4: إنشاء ملف .env.local

**ما الذي سنفعله؟** - إنشاء ملف متغيرات البيئة المحلية

```bash
# تأكد أنك في مجلد المشروع
cd cubes-hr-platform

# أنشئ ملف .env.local
cat > .env.local << 'EOF'
# قاعدة البيانات
DATABASE_URL="mysql://cubes_user:cubes_password_123@localhost:3306/cubes_hr_db"

# الأمان
JWT_SECRET="your_jwt_secret_key_here_min_32_chars_for_security_development_only"

# البيئة
NODE_ENV="development"
PORT=3000

# OAuth
VITE_OAUTH_PORTAL_URL="http://localhost:3000"
VITE_APP_ID="local_app_id"

# Manus APIs (اختياري للتطوير المحلي)
BUILT_IN_FORGE_API_URL="https://api.manus.im"
BUILT_IN_FORGE_API_KEY="your_api_key_here"

# Analytics (اختياري)
VITE_ANALYTICS_ENDPOINT="https://analytics.manus.im"
VITE_ANALYTICS_WEBSITE_ID="your_website_id"
EOF
```

**ماذا حدث؟**
- تم إنشاء ملف `.env.local` في مجلد المشروع
- هذا الملف يحتوي على متغيرات البيئة المحلية
- **مهم:** لا تشارك هذا الملف مع أحد (يحتوي على كلمات مرور)

**التحقق:**
```bash
# تحقق من وجود الملف
cat .env.local

# يجب أن ترى محتويات الملف أعلاه
```

---

### الخطوة 5: تطبيق الهجرات

**ما الذي سنفعله؟** - تطبيق التغييرات على قاعدة البيانات

```bash
# تأكد أنك في مجلد المشروع
cd cubes-hr-platform

# تطبيق الهجرات
pnpm db:push

# ستظهر رسائل مثل:
# - Generating migrations...
# - Applying migrations...
# - Done!
```

**ماذا حدث؟**
- تم تطبيق جميع هجرات قاعدة البيانات
- تم إنشاء جميع الجداول والأعمدة المطلوبة
- قاعدة البيانات جاهزة الآن

**المشاكل الشائعة:**
```bash
# إذا حصلت على خطأ "Cannot connect to database"
# تحقق من:
# 1. MySQL قيد التشغيل
# 2. بيانات الاتصال في .env.local صحيحة
# 3. قاعدة البيانات موجودة

# إذا حصلت على خطأ "Access denied"
# تحقق من كلمة المرور في .env.local
```

---

### الخطوة 6: تشغيل المشروع

**ما الذي سنفعله؟** - تشغيل الخادم والواجهة الأمامية

```bash
# تأكد أنك في مجلد المشروع
cd cubes-hr-platform

# شغل المشروع
pnpm dev

# ستظهر رسائل مثل:
# VITE v5.0.0  ready in 123 ms
# ➜  Local:   http://localhost:3000
# ➜  press h to show help
```

**ماذا حدث؟**
- تم تشغيل الخادم الخلفي (Express)
- تم تشغيل الخادم الأمامي (Vite)
- المشروع جاهز على http://localhost:3000

---

### الخطوة 7: فتح المتصفح

```bash
# افتح متصفحك (Chrome, Firefox, Safari, إلخ)
# اذهب إلى: http://localhost:3000

# يجب أن ترى صفحة تسجيل الدخول
```

---

## 🔑 تسجيل الدخول

بعد فتح المتصفح، استخدم أحد الحسابات التالية:

### حساب المدير (Admin)
```
البريد الإلكتروني: admin@cubeshr.com
كلمة المرور: admin123
```

### حساب مدير الموارس البشرية (HR Manager)
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

## 🎯 الخطوات الأولى بعد التسجيل

### 1. استكشاف القائمة الجانبية
```
من القائمة الجانبية (اليسار)، يمكنك الوصول إلى:
- الموظفين: إدارة الموظفين
- الحضور: تسجيل الحضور
- الموافقات: إدارة طلبات الموافقات
- التقارير: عرض التقارير
- الإعدادات: إدارة النظام
```

### 2. إضافة موظف جديد
```
1. من القائمة، انقر على "الموظفين"
2. انقر على "إضافة موظف جديد"
3. أدخل البيانات:
   - الاسم: أحمد محمد
   - البريد: ahmed@example.com
   - الرقم الوظيفي: EMP001
   - المسمى: مهندس برمجيات
   - القسم: تطوير
4. انقر على "حفظ"
```

### 3. تسجيل الحضور
```
1. من القائمة، انقر على "الحضور"
2. اختر الموظف من القائمة
3. انقر على "حاضر" أو "غائب"
4. انقر على "حفظ"
```

### 4. إنشاء طلب موافقة
```
1. من القائمة، انقر على "الموافقات"
2. انقر على "طلب موافقة جديد"
3. اختر نوع الطلب (إجازة، عقد، وثيقة، إلخ)
4. اختر الموظف
5. أدخل الوصف
6. انقر على "إرسال"
```

---

## 🔧 أوامر مفيدة أثناء التطوير

### تشغيل الاختبارات

```bash
# تشغيل جميع الاختبارات
pnpm test

# تشغيل الاختبارات مع المراقبة (تعاد تلقائياً عند التغيير)
pnpm test:watch

# تشغيل اختبار محدد
pnpm test approvals.test.ts
```

### تنسيق الكود

```bash
# تنسيق جميع الملفات
pnpm format

# التحقق من الأخطاء
pnpm lint
```

### إدارة قاعدة البيانات

```bash
# عرض قاعدة البيانات بصرياً
pnpm db:studio

# سيفتح واجهة بصرية على http://localhost:5555

# إنشاء هجرة جديدة
pnpm db:generate

# تطبيق الهجرات
pnpm db:push
```

### بناء المشروع

```bash
# بناء المشروع للإنتاج
pnpm build

# سيُنشئ مجلد dist/ بالملفات المُحسّنة
```

---

## 🆘 استكشاف الأخطاء الشائعة

### المشكلة 1: "Port 3000 already in use"

**السبب:** المنفذ 3000 مستخدم من قبل برنامج آخر

**الحل:**

```bash
# الطريقة 1: استخدم منفذ مختلف
PORT=3001 pnpm dev

# ثم افتح http://localhost:3001

# الطريقة 2: أغلق البرنامج الذي يستخدم المنفذ 3000
# على Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# على Mac/Linux:
lsof -i :3000
kill -9 <PID>
```

---

### المشكلة 2: "Cannot connect to database"

**السبب:** MySQL لا يعمل أو بيانات الاتصال خاطئة

**الحل:**

```bash
# 1. تأكد من تشغيل MySQL
# على Windows: ابدأ MySQL من Services
# على Mac: brew services start mysql
# على Linux: sudo systemctl start mysql

# 2. تحقق من بيانات الاتصال
cat .env.local | grep DATABASE_URL

# 3. اختبر الاتصال
mysql -u cubes_user -p cubes_hr_db
# أدخل كلمة المرور: cubes_password_123

# 4. إذا لم تنجح، أعد تشغيل MySQL
# على Mac: brew services restart mysql
# على Linux: sudo systemctl restart mysql
```

---

### المشكلة 3: "Module not found"

**السبب:** المكتبات غير مثبتة بشكل صحيح

**الحل:**

```bash
# 1. احذف مجلد node_modules وملف pnpm-lock.yaml
rm -rf node_modules pnpm-lock.yaml

# 2. أعد تثبيت المكتبات
pnpm install

# 3. شغل المشروع مرة أخرى
pnpm dev
```

---

### المشكلة 4: "pnpm: command not found"

**السبب:** pnpm غير مثبت

**الحل:**

```bash
# تثبيت pnpm
npm install -g pnpm

# تحقق من التثبيت
pnpm --version
```

---

### المشكلة 5: "Git command not found"

**السبب:** Git غير مثبت

**الحل:**

```bash
# على Windows: https://git-scm.com/download/win
# على Mac: brew install git
# على Linux: sudo apt-get install git

# تحقق من التثبيت
git --version
```

---

### المشكلة 6: "npm ERR! code EACCES"

**السبب:** مشاكل في الصلاحيات

**الحل:**

```bash
# على Mac/Linux:
sudo pnpm install

# أو غير صلاحيات npm
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
export PATH=~/.npm-global/bin:$PATH
```

---

## 📊 هيكل المشروع

```
cubes-hr-platform/
│
├── client/                    # الواجهة الأمامية (React)
│   ├── src/
│   │   ├── pages/            # الصفحات
│   │   ├── components/       # المكونات
│   │   ├── App.tsx           # التطبيق الرئيسي
│   │   └── main.tsx          # نقطة الدخول
│   ├── index.html            # ملف HTML الرئيسي
│   └── tsconfig.json         # إعدادات TypeScript
│
├── server/                    # الخادم الخلفي (Express + tRPC)
│   ├── routers.ts            # مسارات API
│   ├── db.ts                 # دوال قاعدة البيانات
│   └── _core/                # الملفات الأساسية
│
├── drizzle/                   # قاعدة البيانات
│   ├── schema.ts             # تعريف الجداول
│   └── migrations/           # ملفات الهجرات
│
├── package.json              # المكتبات والإعدادات
├── .env.local                # متغيرات البيئة (محلي فقط)
├── setup.sql                 # تهيئة قاعدة البيانات
└── README.md                 # دليل المشروع
```

---

## ✅ قائمة التحقق النهائية

- [ ] تم تثبيت Git
- [ ] تم تثبيت Node.js و npm
- [ ] تم تثبيت pnpm
- [ ] تم تثبيت MySQL
- [ ] تم استنساخ المشروع من GitHub
- [ ] تم تثبيت المكتبات (`pnpm install`)
- [ ] تم إنشاء قاعدة البيانات (`mysql < setup.sql`)
- [ ] تم إنشاء ملف `.env.local`
- [ ] تم تطبيق الهجرات (`pnpm db:push`)
- [ ] تم تشغيل المشروع (`pnpm dev`)
- [ ] تم فتح http://localhost:3000
- [ ] تم تسجيل الدخول بنجاح
- [ ] تم استكشاف الميزات الأساسية

---

## 🎉 تم!

المشروع جاهز للتطوير! 🚀

**الخطوات التالية:**
1. استكشف الكود في `client/src/` و `server/`
2. اقرأ `README.md` لمزيد من المعلومات
3. اقرأ `USER_GUIDE.md` لفهم الميزات
4. ابدأ بإضافة ميزات جديدة

**للمساعدة:**
- اقرأ الملفات المساعدة الأخرى
- تحقق من استكشاف الأخطاء أعلاه
- تواصل مع الدعم
