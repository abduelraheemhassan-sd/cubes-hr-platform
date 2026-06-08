# 🚀 تشغيل CubesHR على خادم محلي

## 📖 دليل سريع

هذا الملف يحتوي على جميع المعلومات التي تحتاجها لتشغيل منصة CubesHR على جهازك المحلي.

---

## 🎯 الخيارات المتاحة

اختر الطريقة التي تناسبك:

### ✅ الطريقة 1: Docker (الموصى بها - الأسهل)

**المتطلبات:**
- Docker Desktop

**الخطوات:**
```bash
# 1. استنساخ المشروع
git clone https://github.com/your-org/cubes-hr-platform.git
cd cubes-hr-platform

# 2. تشغيل Docker Compose
docker-compose up -d

# 3. انتظر 30 ثانية لتشغيل قاعدة البيانات

# 4. تطبيق الهجرات (في نافذة جديدة)
docker-compose exec app pnpm db:push

# 5. افتح المتصفح
# http://localhost:3000
```

**الفوائد:**
- لا حاجة لتثبيت Node.js أو MySQL
- نفس البيئة على جميع الأجهزة
- سهل الإزالة والتنظيف

**المشاكل الشائعة:**
- إذا كان المنفذ 3000 مشغولاً، غير المنفذ في `docker-compose.yml`
- إذا كانت حاوية MySQL بطيئة، انتظر 30 ثانية إضافية

---

### ✅ الطريقة 2: التشغيل المحلي (الأسرع للتطوير)

**المتطلبات:**
- Node.js 18+
- pnpm
- MySQL 8.0+

**الخطوات:**
```bash
# 1. استنساخ المشروع
git clone https://github.com/your-org/cubes-hr-platform.git
cd cubes-hr-platform

# 2. تثبيت المكتبات
pnpm install

# 3. إنشاء قاعدة بيانات MySQL
mysql -u root -p < setup.sql

# 4. إنشاء ملف .env.local
cat > .env.local << EOF
DATABASE_URL="mysql://cubes_user:cubes_password_123@localhost:3306/cubes_hr_db"
JWT_SECRET="your_jwt_secret_key_here_min_32_chars"
VITE_OAUTH_PORTAL_URL="http://localhost:3000"
VITE_APP_ID="local_app_id"
PORT=3000
EOF

# 5. تطبيق الهجرات
pnpm db:push

# 6. تشغيل الخادم
pnpm dev

# 7. افتح المتصفح
# http://localhost:3000
```

**الفوائد:**
- أسرع للتطوير
- سهل التصحيح
- تحكم كامل على البيئة

**المشاكل الشائعة:**
- تأكد من تشغيل MySQL
- تأكد من تثبيت Node.js و pnpm

---

## 📚 الملفات المساعدة

| الملف | الوصف |
|------|-------|
| `QUICK_START.md` | بدء سريع (5 دقائق) |
| `LOCAL_SETUP.md` | دليل التثبيت المحلي المفصل |
| `DOCKER_SETUP.md` | دليل Docker المفصل |
| `USER_GUIDE.md` | دليل المستخدم الشامل |
| `LAUNCH_REQUIREMENTS.md` | متطلبات الإطلاق |
| `LAUNCH_STEPS.md` | خطوات الإطلاق الرسمي |
| `MARKETING_PLAN.md` | خطة التسويق والنمو |

---

## 🔑 بيانات الدخول

### حساب المدير
- **البريد**: admin@cubeshr.com
- **كلمة المرور**: admin123

### حساب مدير الموارد البشرية
- **البريد**: hr@cubeshr.com
- **كلمة المرور**: hr123

### حساب موظف
- **البريد**: employee@cubeshr.com
- **كلمة المرور**: emp123

---

## 🌐 الوصول إلى التطبيق

بعد التشغيل، يمكنك الوصول إلى:

- **التطبيق**: http://localhost:3000
- **قاعدة البيانات** (محلي فقط): localhost:3306
- **أدوات المطور**: F12 في المتصفح

---

## 🆘 الدعم والمساعدة

### المشاكل الشائعة

**1. "Port 3000 already in use"**
```bash
# استخدم منفذ مختلف
PORT=3001 pnpm dev
```

**2. "Cannot connect to database"**
```bash
# تحقق من MySQL
mysql -u root -p

# أعد تشغيل Docker
docker-compose restart mysql
```

**3. "Module not found"**
```bash
# أعد تثبيت المكتبات
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### الحصول على المساعدة

- 📖 اقرأ `LOCAL_SETUP.md` أو `DOCKER_SETUP.md`
- 📧 البريد الإلكتروني: support@cubeshr.com
- 💬 الدردشة: https://cubeshr.com/chat

---

## ✅ قائمة التحقق

- [ ] اخترت طريقة التشغيل (Docker أو محلي)
- [ ] ثبتت المتطلبات
- [ ] استنسخت المشروع
- [ ] شغلت الخادم
- [ ] فتحت http://localhost:3000
- [ ] سجلت الدخول بنجاح
- [ ] اختبرت ميزة واحدة على الأقل

---

## 🎉 تم!

تهانينا! لقد قمت بتشغيل CubesHR بنجاح.

الخطوات التالية:
1. اقرأ `USER_GUIDE.md` لفهم الميزات
2. جرب الميزات الأساسية
3. اقرأ `LAUNCH_REQUIREMENTS.md` للإطلاق الرسمي

**استمتع بـ CubesHR!** 🚀
