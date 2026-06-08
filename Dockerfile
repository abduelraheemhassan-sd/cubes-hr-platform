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

# مرحلة التطوير
FROM node:18-alpine AS development

WORKDIR /app

# تثبيت pnpm
RUN npm install -g pnpm

# نسخ ملفات المشروع
COPY package.json pnpm-lock.yaml ./

# تثبيت المكتبات (مع dev dependencies)
RUN pnpm install --frozen-lockfile

# نسخ باقي الملفات
COPY . .

# تعيين المتغيرات
ENV NODE_ENV=development
ENV PORT=3000

# فتح المنفذ
EXPOSE 3000

# تشغيل التطبيق في وضع التطوير
CMD ["pnpm", "dev"]

# مرحلة الإنتاج
FROM node:18-alpine AS production

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
CMD ["node", "dist/index.js"]
