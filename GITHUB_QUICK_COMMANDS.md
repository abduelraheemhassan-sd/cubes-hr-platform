# 🚀 أوامر GitHub السريعة

## 📤 رفع المشروع على GitHub (المرة الأولى)

```bash
# 1. انتقل إلى مجلد المشروع
cd /home/ubuntu/cubes-hr-platform

# 2. إذا لم يكن git مهيأ
git init

# 3. أضف المستودع البعيد (استبدل YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/cubes-hr-platform.git

# 4. أضف جميع الملفات
git add .

# 5. أنشئ commit أولي
git commit -m "Initial commit: CubesHR platform with approvals system"

# 6. رفع الملفات
git push -u origin main
```

---

## 📝 أوامر يومية

### إضافة تغييرات جديدة

```bash
# عرض الحالة
git status

# إضافة ملف محدد
git add filename.ts

# أو إضافة جميع الملفات
git add .

# إنشاء commit
git commit -m "feat: add new feature description"

# رفع التغييرات
git push
```

### العمل مع الفروع

```bash
# إنشاء فرع جديد
git checkout -b feature/new-feature

# الانتقال إلى فرع
git checkout main

# رفع الفرع الجديد
git push -u origin feature/new-feature

# دمج الفرع
git merge feature/new-feature

# حذف الفرع
git branch -d feature/new-feature
```

---

## 🔄 سحب التحديثات

```bash
# سحب أحدث التغييرات
git pull

# أو بالتفصيل
git fetch
git merge origin/main
```

---

## 🔍 عرض السجل

```bash
# عرض آخر 10 commits
git log --oneline -10

# عرض التغييرات
git diff

# عرض التغييرات في commit محدد
git show commit-hash
```

---

## 🆘 الأوامر المساعدة

```bash
# التراجع عن آخر commit (بدون حذف الملفات)
git reset --soft HEAD~1

# التراجع عن آخر commit (مع حذف الملفات)
git reset --hard HEAD~1

# إعادة تسمية آخر commit
git commit --amend -m "new message"

# إلغاء تغييرات ملف محدد
git checkout -- filename.ts

# عرض الفروع
git branch -a

# حذف فرع بعيد
git push origin --delete feature/old-feature
```

---

## 📊 معلومات المستودع

```bash
# عرض المستودعات البعيدة
git remote -v

# تغيير URL المستودع
git remote set-url origin https://github.com/NEW_USERNAME/cubes-hr-platform.git

# عرض معلومات المستودع
git remote show origin
```

---

## ✅ نصائح مهمة

1. **اكتب رسائل commit واضحة**: `git commit -m "feat: add approvals system"`
2. **رفع التغييرات يومياً**: `git push`
3. **سحب التحديثات قبل البدء**: `git pull`
4. **استخدم الفروع للميزات الجديدة**: `git checkout -b feature/name`
5. **تجنب الملفات الحساسة**: تأكد من .gitignore

---

**استخدم هذه الأوامر للعمل بكفاءة على GitHub!** 🎉
