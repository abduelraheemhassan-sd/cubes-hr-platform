# 🚀 رفع منصة CubesHR على GitHub للتشغيل

## 📋 الملفات الأساسية المطلوبة لتشغيل المنصة

### ✅ الملفات الإلزامية (يجب رفعها)

```
cubes-hr-platform/
│
├── 📁 client/                          # ✅ الواجهة الأمامية
│   ├── src/
│   │   ├── pages/                      # ✅ الصفحات (Home, Approvals, etc)
│   │   ├── components/                 # ✅ المكونات (DashboardLayout, etc)
│   │   ├── _core/hooks/                # ✅ الـ hooks المخصصة
│   │   ├── lib/                        # ✅ المساعدات
│   │   ├── App.tsx                     # ✅ التطبيق الرئيسي
│   │   ├── main.tsx                    # ✅ نقطة الدخول
│   │   └── index.css                   # ✅ الأنماط العامة
│   ├── public/                         # ✅ الملفات الثابتة (favicon, robots.txt)
│   ├── index.html                      # ✅ ملف HTML الرئيسي
│   └── tsconfig.json                   # ✅ إعدادات TypeScript
│
├── 📁 server/                          # ✅ الخادم الخلفي
│   ├── routers.ts                      # ✅ مسارات tRPC (الموافقات، الموظفين، إلخ)
│   ├── db.ts                           # ✅ دوال قاعدة البيانات
│   ├── approvals.ts                    # ✅ منطق الموافقات
│   ├── auditLog.ts                     # ✅ تسجيل العمليات
│   ├── storage.ts                      # ✅ إدارة الملفات
│   ├── _core/                          # ✅ الملفات الأساسية
│   │   ├── index.ts                    # ✅ نقطة دخول الخادم
│   │   ├── context.ts                  # ✅ سياق tRPC
│   │   ├── auth.ts                     # ✅ المصادقة
│   │   ├── oauth.ts                    # ✅ OAuth
│   │   ├── llm.ts                      # ✅ تكامل LLM
│   │   ├── imageGeneration.ts          # ✅ توليد الصور
│   │   ├── voiceTranscription.ts       # ✅ تحويل الصوت
│   │   ├── notification.ts             # ✅ الإشعارات
│   │   ├── map.ts                      # ✅ خدمات الخرائط
│   │   └── ...                         # ✅ ملفات أخرى
│   └── *.test.ts                       # ✅ الاختبارات
│
├── 📁 drizzle/                         # ✅ قاعدة البيانات
│   ├── schema.ts                       # ✅ تعريف الجداول
│   ├── relations.ts                    # ✅ العلاقات بين الجداول
│   ├── migrations/                     # ✅ ملفات الهجرات
│   │   ├── 0001_*.sql                  # ✅ هجرة الموظفين
│   │   ├── 0002_*.sql                  # ✅ هجرة الحضور
│   │   ├── 0003_*.sql                  # ✅ هجرة الموافقات
│   │   └── ...                         # ✅ هجرات أخرى
│   └── meta/                           # ✅ بيانات وصفية
│
├── 📁 shared/                          # ✅ الأنواع المشتركة
│   ├── types.ts                        # ✅ أنواع TypeScript
│   ├── const.ts                        # ✅ الثوابت
│   └── _core/                          # ✅ الملفات الأساسية
│
├── 📁 storage/                         # ✅ إدارة التخزين
│   └── index.ts                        # ✅ دوال S3
│
├── 📁 references/                      # ✅ المراجع
│   └── periodic-updates.md             # ✅ المهام الدورية
│
├── 📁 .github/                         # ✅ ملفات GitHub
│   ├── workflows/                      # ✅ ملفات CI/CD
│   │   ├── deploy.yml                  # ✅ نشر تلقائي
│   │   └── test.yml                    # ✅ اختبارات تلقائية
│   └── ISSUE_TEMPLATE/                 # ✅ قوالب المشاكل
│
├── 📄 package.json                     # ✅ المكتبات والإعدادات
├── 📄 pnpm-lock.yaml                   # ✅ قفل إصدارات المكتبات
├── 📄 tsconfig.json                    # ✅ إعدادات TypeScript الرئيسية
├── 📄 vite.config.ts                   # ✅ إعدادات Vite
├── 📄 vitest.config.ts                 # ✅ إعدادات الاختبارات
├── 📄 drizzle.config.ts                # ✅ إعدادات Drizzle
│
├── 📄 Dockerfile                       # ✅ ملف Docker
├── 📄 docker-compose.yml               # ✅ ملف Docker Compose
├── 📄 .dockerignore                    # ✅ استبعاد Docker
│
├── 📄 .gitignore                       # ✅ استبعاد Git
├── 📄 .prettierrc                      # ✅ إعدادات التنسيق
├── 📄 .prettierignore                  # ✅ استبعاد التنسيق
│
├── 📄 README.md                        # ✅ دليل المشروع الرئيسي
├── 📄 README_LOCAL.md                  # ✅ دليل التشغيل المحلي
├── 📄 QUICK_START.md                   # ✅ بدء سريع
├── 📄 LOCAL_SETUP.md                   # ✅ دليل التثبيت المحلي
├── 📄 DOCKER_SETUP.md                  # ✅ دليل Docker
├── 📄 GITHUB_GUIDE.md                  # ✅ دليل GitHub
├── 📄 GITHUB_DEPLOYMENT.md             # ✅ هذا الملف
├── 📄 LAUNCH_REQUIREMENTS.md           # ✅ متطلبات الإطلاق
├── 📄 LAUNCH_STEPS.md                  # ✅ خطوات الإطلاق
├── 📄 USER_GUIDE.md                    # ✅ دليل المستخدم
├── 📄 MARKETING_PLAN.md                # ✅ خطة التسويق
│
├── 📄 setup.sql                        # ✅ تهيئة قاعدة البيانات
├── 📄 todo.md                          # ✅ قائمة المهام
└── 📄 .env.example                     # ✅ مثال متغيرات البيئة
```

---

## ❌ الملفات التي لا يتم رفعها

```
❌ node_modules/              # تثبت من package.json
❌ dist/                       # تُبنى من البناء
❌ build/                      # ملفات البناء المؤقتة
❌ .env                        # ملف البيئة الحقيقي (سري)
❌ .env.local                  # متغيرات البيئة المحلية
❌ .env.*.local                # متغيرات البيئة المحلية
❌ .DS_Store                   # ملفات macOS
❌ Thumbs.db                   # ملفات Windows
❌ *.log                        # ملفات السجلات
❌ .vscode/                    # إعدادات VS Code الشخصية
❌ .idea/                      # إعدادات IntelliJ
❌ coverage/                   # تقارير التغطية
❌ .pnpm-store/                # مخزن pnpm المؤقت
```

---

## 🔄 خطوات رفع المشروع على GitHub

### الخطوة 1: إنشاء مستودع على GitHub

```bash
# 1. اذهب إلى https://github.com/new
# 2. أدخل اسم المستودع: cubes-hr-platform
# 3. أضف وصف: "منصة إدارة الموارد البشرية المتكاملة"
# 4. اختر "Private" (خاص) أو "Public" (عام)
# 5. لا تختر "Initialize with README"
# 6. انقر على "Create repository"
```

### الخطوة 2: إعداد Git محلياً

```bash
# انتقل إلى مجلد المشروع
cd /home/ubuntu/cubes-hr-platform

# إذا لم يكن git مهيأ
git init

# أضف بيانات المستخدم
git config user.name "اسمك الكامل"
git config user.email "بريدك@example.com"
```

### الخطوة 3: إضافة المستودع البعيد

```bash
# أضف المستودع البعيد (استبدل YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/cubes-hr-platform.git

# تحقق من الإضافة
git remote -v
```

### الخطوة 4: إضافة الملفات

```bash
# أضف جميع الملفات
git add .

# تحقق من الملفات المراد رفعها
git status

# يجب أن ترى:
# - client/
# - server/
# - drizzle/
# - shared/
# - package.json
# - Dockerfile
# - docker-compose.yml
# - جميع ملفات الوثائق
```

### الخطوة 5: إنشاء Commit أولي

```bash
# أنشئ commit مع رسالة واضحة
git commit -m "Initial commit: CubesHR platform with approvals system

- Add employee management system
- Add attendance tracking
- Add approvals workflow with employee selection
- Add audit logging
- Add Docker and local setup
- Add comprehensive documentation"
```

### الخطوة 6: رفع الملفات

```bash
# رفع الملفات إلى GitHub
git push -u origin main

# أو إذا كان الفرع الافتراضي master
git push -u origin master

# عند الطلب، أدخل بيانات GitHub الخاصة بك
```

---

## 🔐 المصادقة على GitHub

### الطريقة 1: Personal Access Token (الموصى بها)

```bash
# 1. اذهب إلى GitHub Settings → Developer settings → Personal access tokens
# 2. انقر على "Generate new token"
# 3. اختر الصلاحيات:
#    ✅ repo (كامل الوصول للمستودعات)
#    ✅ workflow (إذا كنت تستخدم GitHub Actions)
# 4. انسخ الرمز

# 5. عند الطلب في Terminal:
# Username: your-username
# Password: paste-your-token-here
```

### الطريقة 2: SSH (الأسرع)

```bash
# 1. أنشئ مفتاح SSH
ssh-keygen -t ed25519 -C "بريدك@example.com"

# 2. اضغط Enter للملف الافتراضي
# 3. أدخل كلمة مرور (اختياري)

# 4. أضف المفتاح العام إلى GitHub
cat ~/.ssh/id_ed25519.pub

# 5. اذهب إلى GitHub Settings → SSH and GPG keys
# 6. انقر على "New SSH key"
# 7. الصق المفتاح

# 8. اختبر الاتصال
ssh -T git@github.com

# 9. استخدم SSH URL
git remote set-url origin git@github.com:YOUR_USERNAME/cubes-hr-platform.git
```

---

## 📝 ملف .env.example

أنشئ ملف `.env.example` مع القيم الافتراضية (بدون قيم سرية):

```bash
# أنشئ الملف
cat > .env.example << 'EOF'
# قاعدة البيانات
DATABASE_URL="mysql://user:password@localhost:3306/cubes_hr_db"

# الأمان
JWT_SECRET="your_jwt_secret_key_here_min_32_chars"

# البيئة
NODE_ENV="development"
PORT=3000

# OAuth
VITE_OAUTH_PORTAL_URL="http://localhost:3000"
VITE_APP_ID="local_app_id"

# Manus APIs
BUILT_IN_FORGE_API_URL="https://api.manus.im"
BUILT_IN_FORGE_API_KEY="your_api_key_here"

# Analytics
VITE_ANALYTICS_ENDPOINT="https://analytics.manus.im"
VITE_ANALYTICS_WEBSITE_ID="your_website_id"
EOF

# أضفه إلى Git
git add .env.example
git commit -m "docs: add .env.example template"
```

---

## 🔍 التحقق قبل الرفع

```bash
# 1. تحقق من .gitignore
cat .gitignore | grep -E "node_modules|dist|\.env"

# 2. تحقق من الملفات المراد رفعها
git status

# 3. تأكد من عدم وجود ملفات حساسة
git status | grep -E "\.env|node_modules|dist"

# 4. شغل الاختبارات
pnpm test

# 5. تحقق من التنسيق
pnpm format

# 6. تحقق من الأخطاء
pnpm lint
```

---

## 📊 التحقق بعد الرفع

```bash
# 1. اذهب إلى https://github.com/YOUR_USERNAME/cubes-hr-platform
# 2. تحقق من وجود جميع الملفات
# 3. تحقق من عدم وجود node_modules أو dist
# 4. اقرأ README.md
```

---

## 🚀 تشغيل المنصة من GitHub

### من جهاز جديد

```bash
# 1. استنساخ المستودع
git clone https://github.com/YOUR_USERNAME/cubes-hr-platform.git
cd cubes-hr-platform

# 2. تثبيت المكتبات
pnpm install

# 3. إنشاء ملف .env من .env.example
cp .env.example .env.local

# 4. تحديث .env.local بالقيم الحقيقية
# DATABASE_URL="mysql://..."
# JWT_SECRET="..."

# 5. تطبيق الهجرات
pnpm db:push

# 6. تشغيل المنصة
pnpm dev

# 7. افتح http://localhost:3000
```

### باستخدام Docker

```bash
# 1. استنساخ المستودع
git clone https://github.com/YOUR_USERNAME/cubes-hr-platform.git
cd cubes-hr-platform

# 2. تشغيل Docker Compose
docker-compose up -d

# 3. انتظر 30 ثانية

# 4. تطبيق الهجرات (في نافذة جديدة)
docker-compose exec app pnpm db:push

# 5. افتح http://localhost:3000
```

---

## 📋 قائمة التحقق النهائية

- [ ] تم إنشاء مستودع على GitHub
- [ ] تم إعداد Git محلياً
- [ ] تم إضافة المستودع البعيد
- [ ] تم التحقق من .gitignore
- [ ] تم إنشاء .env.example
- [ ] تم التحقق من عدم وجود ملفات حساسة
- [ ] تم تشغيل الاختبارات بنجاح
- [ ] تم تنسيق الكود
- [ ] تم إنشاء commit أولي واضح
- [ ] تم رفع الملفات إلى GitHub
- [ ] تم التحقق من المستودع على GitHub
- [ ] تم اختبار الاستنساخ من GitHub
- [ ] تم اختبار التشغيل من GitHub

---

## 📚 الملفات المساعدة

| الملف | الوصف |
|------|-------|
| `README.md` | دليل المشروع الرئيسي |
| `QUICK_START.md` | بدء سريع (5 دقائق) |
| `LOCAL_SETUP.md` | دليل التثبيت المحلي |
| `DOCKER_SETUP.md` | دليل Docker |
| `GITHUB_GUIDE.md` | دليل GitHub العام |
| `LAUNCH_REQUIREMENTS.md` | متطلبات الإطلاق |
| `USER_GUIDE.md` | دليل المستخدم |

---

## ✅ تم!

المشروع جاهز للرفع على GitHub والتشغيل من أي مكان! 🚀

**الخطوات التالية:**
1. اتبع الخطوات أعلاه لرفع المشروع
2. اختبر الاستنساخ من GitHub
3. اختبر التشغيل على جهاز جديد
4. شارك المستودع مع فريقك
