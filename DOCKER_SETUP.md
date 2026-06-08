# دليل Docker - تشغيل CubesHR في حاوية

## 📦 ما هو Docker؟

Docker هو أداة تسمح بتشغيل التطبيق في بيئة معزولة (حاوية) بنفس الطريقة على أي جهاز. هذا يعني لا مزيد من مشاكل "يعمل على جهازي لكن لا يعمل على جهازك".

---

## 🚀 التثبيت السريع باستخدام Docker

### المتطلبات

- **Docker**: تحميل من https://www.docker.com/products/docker-desktop
- **Docker Compose**: عادة يأتي مع Docker Desktop

### التحقق من التثبيت

```bash
# تحقق من تثبيت Docker
docker --version

# تحقق من تثبيت Docker Compose
docker-compose --version
```

---

## 🐳 تشغيل CubesHR مع Docker

### الخطوة 1: استنساخ المشروع

```bash
git clone https://github.com/your-org/cubes-hr-platform.git
cd cubes-hr-platform
```

### الخطوة 2: بناء الصورة

```bash
# بناء صورة Docker
docker build -t cubes-hr:latest .
```

**ملاحظة**: قد يستغرق البناء 5-10 دقائق في المرة الأولى.

### الخطوة 3: تشغيل الحاوية

```bash
# تشغيل الحاوية
docker run -p 3000:3000 \
  -e DATABASE_URL="mysql://user:password@host:3306/db" \
  -e JWT_SECRET="your_secret_key" \
  cubes-hr:latest
```

### الخطوة 4: فتح المتصفح

افتح `http://localhost:3000` في متصفحك.

---

## 🐳 تشغيل مع Docker Compose (الطريقة الموصى بها)

### الخطوة 1: أنشئ ملف `docker-compose.yml`

```yaml
version: '3.8'

services:
  # قاعدة البيانات
  mysql:
    image: mysql:8.0
    container_name: cubes-hr-mysql
    environment:
      MYSQL_ROOT_PASSWORD: root_password_123
      MYSQL_DATABASE: cubes_hr_db
      MYSQL_USER: cubes_user
      MYSQL_PASSWORD: cubes_password_123
    ports:
      - "3306:3306"
    volumes:
      - mysql_data:/var/lib/mysql
    networks:
      - cubes-network
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost"]
      timeout: 20s
      retries: 10

  # تطبيق CubesHR
  app:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: cubes-hr-app
    environment:
      DATABASE_URL: "mysql://cubes_user:cubes_password_123@mysql:3306/cubes_hr_db"
      JWT_SECRET: "your_jwt_secret_key_here_min_32_chars"
      NODE_ENV: "development"
      PORT: 3000
    ports:
      - "3000:3000"
    depends_on:
      mysql:
        condition: service_healthy
    networks:
      - cubes-network
    volumes:
      - .:/app
      - /app/node_modules
    command: pnpm dev

volumes:
  mysql_data:

networks:
  cubes-network:
    driver: bridge
```

### الخطوة 2: أنشئ ملف `Dockerfile`

```dockerfile
# مرحلة البناء
FROM node:18-alpine AS builder

WORKDIR /app

# نسخ ملفات المشروع
COPY package.json pnpm-lock.yaml ./

# تثبيت pnpm
RUN npm install -g pnpm

# تثبيت المكتبات
RUN pnpm install --frozen-lockfile

# نسخ باقي الملفات
COPY . .

# بناء المشروع
RUN pnpm build

# مرحلة الإنتاج
FROM node:18-alpine

WORKDIR /app

# تثبيت pnpm
RUN npm install -g pnpm

# نسخ ملفات المشروع
COPY package.json pnpm-lock.yaml ./

# تثبيت المكتبات (بدون dev dependencies)
RUN pnpm install --prod --frozen-lockfile

# نسخ الملفات المبنية من مرحلة البناء
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/client/dist ./client/dist

# تعيين المتغيرات
ENV NODE_ENV=production
ENV PORT=3000

# فتح المنفذ
EXPOSE 3000

# تشغيل التطبيق
CMD ["pnpm", "start"]
```

### الخطوة 3: تشغيل Docker Compose

```bash
# بناء وتشغيل الحاويات
docker-compose up -d

# عرض السجلات
docker-compose logs -f

# إيقاف الحاويات
docker-compose down

# إعادة تشغيل الحاويات
docker-compose restart
```

---

## 🔧 الأوامر المفيدة

### إدارة الحاويات

```bash
# عرض الحاويات الجارية
docker ps

# عرض جميع الحاويات
docker ps -a

# إيقاف حاوية
docker stop cubes-hr-app

# حذف حاوية
docker rm cubes-hr-app

# عرض السجلات
docker logs cubes-hr-app

# الدخول إلى الحاوية
docker exec -it cubes-hr-app bash
```

### إدارة الصور

```bash
# عرض الصور
docker images

# حذف صورة
docker rmi cubes-hr:latest

# بناء صورة جديدة
docker build -t cubes-hr:latest .
```

### إدارة Docker Compose

```bash
# عرض الخدمات
docker-compose ps

# عرض السجلات
docker-compose logs -f

# تشغيل أمر في الحاوية
docker-compose exec app pnpm test

# إعادة بناء الصور
docker-compose build --no-cache
```

---

## 🌐 الوصول إلى التطبيق

بعد تشغيل Docker Compose، يمكنك الوصول إلى:

- **التطبيق**: http://localhost:3000
- **قاعدة البيانات**: localhost:3306
  - المستخدم: `cubes_user`
  - كلمة المرور: `cubes_password_123`

---

## 📊 إدارة قاعدة البيانات

### الدخول إلى MySQL من الحاوية

```bash
# الدخول إلى حاوية MySQL
docker-compose exec mysql mysql -u cubes_user -p cubes_hr_db

# أو من خارج الحاوية
mysql -h 127.0.0.1 -u cubes_user -p cubes_hr_db
```

### تطبيق الهجرات

```bash
# تشغيل الهجرات
docker-compose exec app pnpm db:push
```

---

## 🐛 استكشاف الأخطاء

### المشكلة 1: "Port 3000 already in use"

**الحل:**
```bash
# غير المنفذ في docker-compose.yml
ports:
  - "3001:3000"  # استخدم 3001 بدلاً من 3000
```

### المشكلة 2: "Cannot connect to database"

**الحل:**
```bash
# تحقق من أن MySQL يعمل
docker-compose ps

# تحقق من السجلات
docker-compose logs mysql

# أعد تشغيل الخدمات
docker-compose restart
```

### المشكلة 3: "Out of memory"

**الحل:**
```bash
# زيادة الذاكرة المخصصة لـ Docker
# على Docker Desktop:
# Settings → Resources → Memory: اجعلها 4GB أو أكثر
```

### المشكلة 4: "Permission denied"

**الحل:**
```bash
# على Linux، قد تحتاج إلى sudo
sudo docker-compose up -d

# أو أضف المستخدم إلى مجموعة docker
sudo usermod -aG docker $USER
```

---

## 🔒 الأمان

### نصائح الأمان

1. **غير كلمات المرور الافتراضية**:
   ```yaml
   environment:
     MYSQL_ROOT_PASSWORD: your_strong_password_here
     MYSQL_PASSWORD: your_strong_password_here
   ```

2. **استخدم متغيرات البيئة**:
   ```bash
   # أنشئ ملف .env
   DATABASE_PASSWORD=your_password
   JWT_SECRET=your_secret
   
   # استخدمه في docker-compose.yml
   environment:
     DATABASE_URL: "mysql://user:${DATABASE_PASSWORD}@mysql:3306/db"
   ```

3. **لا تشارك ملفات البيئة**:
   ```bash
   # أضف .env إلى .gitignore
   echo ".env" >> .gitignore
   ```

---

## 📈 الإنتاج

### بناء صورة للإنتاج

```bash
# بناء صورة محسنة للإنتاج
docker build -t cubes-hr:production --target production .

# تشغيل الصورة
docker run -p 3000:3000 \
  -e DATABASE_URL="mysql://..." \
  -e NODE_ENV="production" \
  cubes-hr:production
```

### نشر على خادم سحابي

```bash
# مثال: نشر على AWS ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 123456789.dkr.ecr.us-east-1.amazonaws.com

docker tag cubes-hr:latest 123456789.dkr.ecr.us-east-1.amazonaws.com/cubes-hr:latest

docker push 123456789.dkr.ecr.us-east-1.amazonaws.com/cubes-hr:latest
```

---

## 📚 الموارد الإضافية

- **Docker Documentation**: https://docs.docker.com/
- **Docker Compose**: https://docs.docker.com/compose/
- **Docker Hub**: https://hub.docker.com/
- **Best Practices**: https://docs.docker.com/develop/dev-best-practices/

---

## ✅ قائمة التحقق

- [ ] تثبيت Docker و Docker Compose
- [ ] استنساخ المشروع
- [ ] إنشاء ملفات Docker و docker-compose.yml
- [ ] بناء الصورة
- [ ] تشغيل Docker Compose
- [ ] فتح http://localhost:3000
- [ ] التحقق من قاعدة البيانات
- [ ] تشغيل الاختبارات

---

**تم! الآن يمكنك تشغيل CubesHR في Docker بسهولة.** 🐳
