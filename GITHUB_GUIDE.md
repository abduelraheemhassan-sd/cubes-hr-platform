# 📤 دليل رفع المشروع على GitHub

## 📋 الملفات التي يتم رفعها على GitHub

### ✅ الملفات المهمة (يجب رفعها)

```
cubes-hr-platform/
├── client/                    # ✅ كود الواجهة الأمامية
│   ├── src/                   # ✅ الملفات المصدرية
│   ├── public/                # ✅ الملفات الثابتة الصغيرة
│   └── index.html             # ✅ ملف HTML الرئيسي
├── server/                    # ✅ كود الخادم
│   ├── routers.ts             # ✅ مسارات tRPC
│   ├── db.ts                  # ✅ دوال قاعدة البيانات
│   ├── approvals.ts           # ✅ منطق الموافقات
│   └── _core/                 # ✅ الملفات الأساسية
├── drizzle/                   # ✅ ملفات الهجرات
│   ├── schema.ts              # ✅ تعريف الجداول
│   └── migrations/            # ✅ ملفات الهجرات
├── shared/                    # ✅ الأنواع المشتركة
├── package.json               # ✅ المكتبات والإعدادات
├── pnpm-lock.yaml             # ✅ قفل الإصدارات
├── tsconfig.json              # ✅ إعدادات TypeScript
├── vite.config.ts             # ✅ إعدادات Vite
├── vitest.config.ts           # ✅ إعدادات الاختبارات
├── Dockerfile                 # ✅ ملف Docker
├── docker-compose.yml         # ✅ ملف Docker Compose
├── .dockerignore              # ✅ استبعاد Docker
├── .gitignore                 # ✅ استبعاد Git
├── .prettierrc                # ✅ إعدادات التنسيق
├── README.md                  # ✅ دليل المشروع الرئيسي
├── LAUNCH_REQUIREMENTS.md     # ✅ متطلبات الإطلاق
├── LAUNCH_STEPS.md            # ✅ خطوات الإطلاق
├── USER_GUIDE.md              # ✅ دليل المستخدم
├── MARKETING_PLAN.md          # ✅ خطة التسويق
├── LOCAL_SETUP.md             # ✅ دليل التثبيت المحلي
├── DOCKER_SETUP.md            # ✅ دليل Docker
├── QUICK_START.md             # ✅ بدء سريع
├── README_LOCAL.md            # ✅ دليل التشغيل المحلي
├── GITHUB_GUIDE.md            # ✅ هذا الملف
├── .github/                   # ✅ ملفات GitHub
│   ├── workflows/             # ✅ ملفات CI/CD
│   └── ISSUE_TEMPLATE/        # ✅ قوالب المشاكل
└── todo.md                    # ✅ قائمة المهام
```

### ❌ الملفات التي لا يتم رفعها (استبعادها)

```
cubes-hr-platform/
├── node_modules/              # ❌ المكتبات (تثبت من package.json)
├── dist/                       # ❌ الملفات المبنية (تُبنى من البناء)
├── build/                      # ❌ ملفات البناء
├── .env                        # ❌ متغيرات البيئة السرية
├── .env.local                  # ❌ متغيرات البيئة المحلية
├── .env.*.local                # ❌ متغيرات البيئة المحلية
├── .DS_Store                   # ❌ ملفات macOS
├── Thumbs.db                   # ❌ ملفات Windows
├── *.log                       # ❌ ملفات السجلات
├── .vscode/                    # ❌ إعدادات VS Code الشخصية
├── .idea/                      # ❌ إعدادات IntelliJ
├── *.swp                       # ❌ ملفات Vim المؤقتة
├── *.swo                       # ❌ ملفات Vim المؤقتة
├── *~                          # ❌ ملفات النسخ الاحتياطية
├── .turbo/                     # ❌ ملفات Turbo المؤقتة
├── coverage/                   # ❌ تقارير التغطية
├── .nyc_output/                # ❌ بيانات التغطية
├── .pnpm-store/                # ❌ مخزن pnpm
├── .next/                      # ❌ ملفات Next.js المؤقتة
└── webdev-static-assets/       # ❌ الأصول المرفوعة (خارج المشروع)
```

---

## 🔧 إعداد ملف .gitignore

تأكد من أن ملف `.gitignore` يحتوي على:

```gitignore
# Dependencies
node_modules/
.pnpm-store/

# Build outputs
dist/
build/
*.dist

# Generated files
*.tsbuildinfo
coverage/

# Package files
package-lock.json
pnpm-lock.yaml

# Database
*.db
*.sqlite
*.sqlite3

# Logs
*.log

# Environment files
.env
.env.local
.env.*.local

# IDE files
.vscode/
.idea/

# OS files
.DS_Store
Thumbs.db

# Temporary files
*.swp
*.swo
*~
.turbo/
.nyc_output/

# Optional npm cache directory
.npm

# Optional eslint cache
.eslintcache

# Misc
.next
```

---

## 🚀 خطوات رفع المشروع على GitHub

### الخطوة 1: إنشاء مستودع على GitHub

```bash
# 1. اذهب إلى https://github.com/new
# 2. أدخل اسم المستودع: cubes-hr-platform
# 3. اختر "Private" (خاص) أو "Public" (عام)
# 4. لا تختر "Initialize with README" (سنستخدم الملف الموجود)
# 5. انقر على "Create repository"
```

### الخطوة 2: إعداد Git محلياً

```bash
# انتقل إلى مجلد المشروع
cd /home/ubuntu/cubes-hr-platform

# تهيئة Git (إذا لم يكن مهيأ)
git init

# إضافة اسم المستخدم والبريد الإلكتروني
git config user.name "اسمك"
git config user.email "بريدك@example.com"

# أو عالمياً لجميع المشاريع
git config --global user.name "اسمك"
git config --global user.email "بريدك@example.com"
```

### الخطوة 3: إضافة المستودع البعيد

```bash
# أضف المستودع البعيد
git remote add origin https://github.com/your-username/cubes-hr-platform.git

# تحقق من الإضافة
git remote -v
```

### الخطوة 4: رفع الملفات

```bash
# أضف جميع الملفات
git add .

# تحقق من الملفات المراد رفعها
git status

# أنشئ commit أولي
git commit -m "Initial commit: CubesHR platform with approvals system"

# رفع الملفات إلى GitHub
git push -u origin main

# أو إذا كان الفرع الافتراضي master
git push -u origin master
```

---

## 🔐 المصادقة على GitHub

### الطريقة 1: استخدام Personal Access Token (الموصى بها)

```bash
# 1. اذهب إلى GitHub Settings → Developer settings → Personal access tokens
# 2. انقر على "Generate new token"
# 3. اختر الصلاحيات:
#    - repo (كامل الوصول للمستودعات)
#    - workflow (إذا كنت تستخدم GitHub Actions)
# 4. انسخ الرمز

# 2. عند الطلب في Terminal، استخدم الرمز كلمة المرور
git push -u origin main
# Username: your-username
# Password: paste-your-token-here
```

### الطريقة 2: استخدام SSH (الأسرع)

```bash
# 1. أنشئ مفتاح SSH
ssh-keygen -t ed25519 -C "بريدك@example.com"

# 2. اضغط Enter للملف الافتراضي
# 3. أدخل كلمة مرور (اختياري)

# 4. أضف المفتاح العام إلى GitHub
cat ~/.ssh/id_ed25519.pub
# انسخ المخرجات

# 5. اذهب إلى GitHub Settings → SSH and GPG keys
# 6. انقر على "New SSH key"
# 7. الصق المفتاح

# 8. اختبر الاتصال
ssh -T git@github.com

# 9. استخدم SSH URL عند الاستنساخ
git remote set-url origin git@github.com:your-username/cubes-hr-platform.git
```

---

## 📝 الأوامر الأساسية

### عرض الحالة

```bash
# عرض حالة المستودع
git status

# عرض السجل
git log

# عرض الفروع
git branch -a
```

### إضافة وتحديث الملفات

```bash
# إضافة ملف محدد
git add filename.ts

# إضافة جميع الملفات
git add .

# إضافة جميع الملفات المعدلة (بدون ملفات جديدة)
git add -u

# إنشاء commit
git commit -m "رسالة واضحة عن التغييرات"

# تعديل آخر commit
git commit --amend

# رفع التغييرات
git push

# سحب التغييرات
git pull
```

### العمل مع الفروع

```bash
# إنشاء فرع جديد
git checkout -b feature/new-feature

# الانتقال إلى فرع
git checkout main

# دمج فرع
git merge feature/new-feature

# حذف فرع
git branch -d feature/new-feature

# رفع فرع جديد
git push -u origin feature/new-feature
```

---

## 🔄 سير العمل الموصى به

### 1. البدء بميزة جديدة

```bash
# 1. انتقل إلى main
git checkout main

# 2. اسحب أحدث التغييرات
git pull origin main

# 3. أنشئ فرع جديد
git checkout -b feature/approvals-system

# 4. ابدأ العمل على الميزة
# ... اكتب الكود ...

# 5. أضف التغييرات
git add .

# 6. أنشئ commit
git commit -m "feat: add approvals system with employee selection"

# 7. رفع الفرع
git push -u origin feature/approvals-system
```

### 2. إنشاء Pull Request

```bash
# 1. اذهب إلى GitHub
# 2. انقر على "Compare & pull request"
# 3. أضف وصف واضح
# 4. انقر على "Create pull request"
# 5. اطلب مراجعة من فريقك
# 6. بعد الموافقة، دمج الفرع
```

### 3. دمج التغييرات

```bash
# 1. اذهب إلى الـ Pull Request
# 2. انقر على "Merge pull request"
# 3. اختر "Squash and merge" أو "Create a merge commit"
# 4. انقر على "Confirm merge"

# 5. محلياً، انتقل إلى main
git checkout main

# 6. اسحب التغييرات
git pull origin main

# 7. احذف الفرع المحلي
git branch -d feature/approvals-system
```

---

## 📦 ملف README.md الرئيسي

تأكد من أن `README.md` يحتوي على:

```markdown
# CubesHR - منصة إدارة الموارد البشرية المتكاملة

وصف قصير عن المشروع...

## 🚀 البدء السريع

### المتطلبات
- Node.js 18+
- Docker (اختياري)
- MySQL 8.0+

### التثبيت

#### الطريقة 1: Docker
\`\`\`bash
docker-compose up -d
\`\`\`

#### الطريقة 2: محلي
\`\`\`bash
pnpm install
pnpm dev
\`\`\`

## 📚 الوثائق

- [دليل المستخدم](USER_GUIDE.md)
- [دليل التثبيت المحلي](LOCAL_SETUP.md)
- [دليل Docker](DOCKER_SETUP.md)
- [متطلبات الإطلاق](LAUNCH_REQUIREMENTS.md)

## 📄 الترخيص

MIT License

## 📞 الدعم

support@cubeshr.com
```

---

## 🔒 الملفات السرية

### ملف .env (لا يتم رفعه)

```bash
# أنشئ ملف .env.example مع قيم افتراضية
DATABASE_URL="mysql://user:password@localhost:3306/db"
JWT_SECRET="your_secret_key"
NODE_ENV="development"
```

### رفع .env.example فقط

```bash
# انسخ .env إلى .env.example
cp .env .env.example

# عدّل .env.example لإزالة القيم السرية
# ثم أضفه إلى Git
git add .env.example
git commit -m "docs: add .env.example template"
```

---

## 🔍 التحقق قبل الرفع

```bash
# 1. تحقق من .gitignore
cat .gitignore

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

## 📊 الملفات الإحصائية

بعد الرفع، يمكنك عرض:

```bash
# عدد الملفات
find . -type f | wc -l

# حجم المستودع
du -sh .

# عدد الأسطر البرمجية
find . -name "*.ts" -o -name "*.tsx" | xargs wc -l
```

---

## 🎯 قائمة التحقق قبل الرفع

- [ ] تم إنشاء مستودع على GitHub
- [ ] تم إعداد Git محلياً
- [ ] تم إضافة المستودع البعيد
- [ ] تم تحديث .gitignore
- [ ] تم التحقق من عدم وجود ملفات حساسة
- [ ] تم تشغيل الاختبارات بنجاح
- [ ] تم تنسيق الكود
- [ ] تم إنشاء commit أولي واضح
- [ ] تم رفع الملفات إلى GitHub
- [ ] تم التحقق من المستودع على GitHub

---

**تم! المشروع جاهز للرفع على GitHub.** 🚀
