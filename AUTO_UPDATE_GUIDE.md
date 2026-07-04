# 🔄 دليل التحديثات المستمرة من GitHub

هذا الدليل يشرح كيفية تحديث البرنامج تلقائياً من GitHub.

---

## ❓ السؤال الأساسي

**هل يقوم البرنامج بتحديث مستمر من GitHub تلقائياً؟**

**الإجابة:** 
- ❌ **لا** - البرنامج لا يتحدث تلقائياً
- ✅ **نعم** - يمكنك إعداده للتحديث التلقائي

---

## 📊 الوضع الحالي

### الآن (بدون تحديث تلقائي)

```
┌─────────────────────────────────────┐
│  GitHub (المستودع البعيد)          │
│  - الكود الأحدث                    │
│  - آخر تحديثات                     │
└─────────────────────────────────────┘
           ↓ (يدوي فقط)
┌─────────────────────────────────────┐
│  جهازك المحلي                       │
│  - الكود الحالي                    │
│  - قد يكون قديماً                  │
└─────────────────────────────────────┘
```

**ماذا يعني هذا؟**
- عندما يتم تحديث الكود على GitHub، جهازك لا يعرف بذلك
- يجب عليك تحديث الكود يدوياً باستخدام أوامر Git

---

## 🔄 طرق التحديث

### الطريقة 1: التحديث اليدوي (الحالي)

**الخطوات:**

```bash
# 1. انتقل إلى مجلد المشروع
cd cubes-hr-platform

# 2. سحب آخر التحديثات من GitHub
git pull origin main

# 3. تثبيت أي مكتبات جديدة
pnpm install

# 4. تطبيق أي هجرات قاعدة بيانات جديدة
pnpm db:push

# 5. أعد تشغيل البرنامج
pnpm dev
```

**المميزات:**
- ✅ تحكم كامل
- ✅ آمن - تراجع قبل التحديث
- ✅ سهل الفهم

**العيوب:**
- ❌ يدوي - يجب أن تتذكر التحديث
- ❌ قد تنسى التحديث
- ❌ قد تفوتك ميزات جديدة

---

### الطريقة 2: التحديث التلقائي (موصى به)

#### أ) استخدام GitHub Actions (للخادم)

**ما هو؟** - برنامج يعمل على GitHub ويحدث الخادم تلقائياً

**الخطوات:**

```bash
# 1. أنشئ ملف في مجلد المشروع
mkdir -p .github/workflows

# 2. أنشئ ملف التحديث التلقائي
cat > .github/workflows/auto-update.yml << 'EOF'
name: Auto Update Server

on:
  push:
    branches:
      - main
  schedule:
    # تحديث كل ساعة
    - cron: '0 * * * *'

jobs:
  update:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Pull latest changes
        run: |
          git pull origin main

      - name: Install dependencies
        run: |
          npm install -g pnpm
          pnpm install

      - name: Apply database migrations
        run: pnpm db:push

      - name: Restart server
        run: |
          # أعد تشغيل الخادم هنا
          # حسب نوع الخادم الذي تستخدمه
EOF

# 3. رفع الملف على GitHub
git add .github/workflows/auto-update.yml
git commit -m "ci: add auto-update workflow"
git push origin main
```

**المميزات:**
- ✅ تلقائي - لا تحتاج لفعل شيء
- ✅ منتظم - يحدث كل ساعة
- ✅ آمن - يعمل على GitHub

**العيوب:**
- ❌ معقد - يحتاج إعداد
- ❌ قد يفشل - يحتاج مراقبة

---

#### ب) استخدام Webhook (للخادم الخاص بك)

**ما هو؟** - عندما يتم دفع كود جديد، GitHub يرسل إشارة إلى خادمك

**الخطوات:**

```bash
# 1. أنشئ سكريبت التحديث
cat > /home/ubuntu/cubes-hr-platform/auto-update.sh << 'EOF'
#!/bin/bash

# الذهاب إلى مجلد المشروع
cd /home/ubuntu/cubes-hr-platform

# سحب آخر التحديثات
git pull origin main

# تثبيت المكتبات
pnpm install

# تطبيق الهجرات
pnpm db:push

# أعد تشغيل البرنامج
# (حسب نوع الخادم)
systemctl restart cubes-hr-platform

# سجل التحديث
echo "Updated at $(date)" >> /var/log/cubes-hr-platform-updates.log
EOF

# 2. اجعل السكريبت قابل للتنفيذ
chmod +x /home/ubuntu/cubes-hr-platform/auto-update.sh

# 3. أضف Webhook على GitHub
# - اذهب إلى: https://github.com/YOUR_USERNAME/cubes-hr-platform/settings/hooks
# - انقر على "Add webhook"
# - أدخل URL الخادم الخاص بك
# - اختر "Just the push event"
# - انقر على "Add webhook"
```

**المميزات:**
- ✅ فوري - يحدث عند الدفع
- ✅ آمن - يعمل على خادمك
- ✅ موثوق - لا يعتمد على GitHub

**العيوب:**
- ❌ معقد - يحتاج إعداد خادم
- ❌ قد يفشل - يحتاج مراقبة

---

#### ج) استخدام Cron Job (للخادم المحلي)

**ما هو؟** - برنامج يعمل كل فترة زمنية معينة

**الخطوات:**

```bash
# 1. أنشئ سكريبت التحديث
cat > /home/ubuntu/cubes-hr-platform/check-updates.sh << 'EOF'
#!/bin/bash

cd /home/ubuntu/cubes-hr-platform

# تحقق من التحديثات
git fetch origin

# إذا كان هناك تحديثات جديدة
if [ $(git rev-parse HEAD) != $(git rev-parse origin/main) ]; then
    echo "Updates found! Pulling..."
    git pull origin main
    pnpm install
    pnpm db:push
    
    # أعد تشغيل البرنامج
    # (حسب نوع الخادم)
    pkill -f "pnpm dev"
    pnpm dev &
    
    echo "Updated at $(date)" >> /var/log/cubes-hr-platform-updates.log
fi
EOF

# 2. اجعل السكريبت قابل للتنفيذ
chmod +x /home/ubuntu/cubes-hr-platform/check-updates.sh

# 3. أضف إلى Cron
crontab -e

# أضف السطر التالي (تحديث كل ساعة):
# 0 * * * * /home/ubuntu/cubes-hr-platform/check-updates.sh

# أو (تحديث كل 30 دقيقة):
# */30 * * * * /home/ubuntu/cubes-hr-platform/check-updates.sh

# أو (تحديث يومياً في الساعة 2 صباحاً):
# 0 2 * * * /home/ubuntu/cubes-hr-platform/check-updates.sh
```

**المميزات:**
- ✅ تلقائي - يعمل في الخلفية
- ✅ منتظم - يعمل في أوقات محددة
- ✅ بسيط - سهل الإعداد

**العيوب:**
- ❌ قد يفشل - يحتاج مراقبة
- ❌ قد يسبب توقف - عند التحديث

---

## 🎯 التوصية

### للتطوير المحلي:
```
استخدم التحديث اليدوي (الطريقة 1)
- اكتب: git pull origin main
- كل يوم أو حسب الحاجة
```

### للخادم الإنتاجي:
```
استخدم GitHub Actions (الطريقة 2أ)
- تلقائي وآمن
- يعمل على GitHub
- لا يحتاج خادم خاص
```

### للخادم الخاص:
```
استخدم Webhook (الطريقة 2ب)
- فوري وموثوق
- يحدث عند الدفع
- يحتاج خادم خاص
```

---

## 🔍 كيفية التحقق من التحديثات

### التحقق اليدوي

```bash
# 1. تحقق من الفرق بين الكود المحلي والبعيد
git fetch origin
git log --oneline -10 origin/main

# 2. عرض التغييرات
git diff HEAD origin/main

# 3. عرض الملفات المتغيرة
git diff --name-only HEAD origin/main

# 4. سحب التحديثات
git pull origin main
```

### عرض سجل التحديثات

```bash
# عرض آخر 20 تحديث
git log --oneline -20

# عرض التحديثات بتفاصيل
git log --pretty=format:"%h - %an, %ar : %s"

# عرض التحديثات اليومية
git log --since="1 day ago"
```

---

## 🚨 نصائح مهمة

### قبل التحديث

```bash
# 1. تأكد من حفظ عملك
git status

# 2. إذا كان لديك تغييرات محلية
git stash

# 3. ثم حدّث
git pull origin main

# 4. ثم استرجع التغييرات
git stash pop
```

### إذا حدث خطأ

```bash
# التراجع عن آخر تحديث
git reset --hard HEAD~1

# أو العودة إلى commit محدد
git reset --hard <commit-hash>

# أو استخدم checkpoint من Manus
# (إذا كنت تستخدم Manus)
```

### مراقبة التحديثات

```bash
# عرض سجل التحديثات
tail -f /var/log/cubes-hr-platform-updates.log

# أو على Manus
# اذهب إلى Dashboard → Version history
```

---

## 📊 جدول المقارنة

| الطريقة | التلقائي | الأمان | السهولة | الموثوقية |
|--------|---------|-------|--------|----------|
| **يدوي** | ❌ | ✅ | ✅ | ✅ |
| **GitHub Actions** | ✅ | ✅ | ⚠️ | ✅ |
| **Webhook** | ✅ | ✅ | ❌ | ⚠️ |
| **Cron Job** | ✅ | ⚠️ | ✅ | ⚠️ |

---

## ✅ قائمة التحقق

- [ ] فهمت الفرق بين التحديث اليدوي والتلقائي
- [ ] اخترت الطريقة المناسبة لك
- [ ] اختبرت التحديث
- [ ] تأكدت من عمل البرنامج بعد التحديث
- [ ] حفظت سجل التحديثات

---

## 🎉 تم!

الآن أنت تعرف كيفية تحديث البرنامج من GitHub! 🚀

**الخطوات التالية:**
1. اختر طريقة التحديث المناسبة
2. طبقها على جهازك
3. اختبرها
4. راقب التحديثات

**للمساعدة:**
- اقرأ الملفات المساعدة الأخرى
- تواصل مع الدعم عند الحاجة
