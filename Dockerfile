# => Build container
FROM node:21-alpine3.18 AS deps

WORKDIR /app

# 只复制依赖文件
COPY package*.json ./

# 安装依赖
RUN npm ci --only=production


# => Builder
FROM node:21-alpine3.18 AS builder

WORKDIR /app

# 复制依赖文件
COPY package*.json ./

# 安装所有依赖（包括 devDependencies）
RUN npm ci

# 复制源码
COPY . .

# 构建 Next.js 应用
ENV GENERATE_SOURCEMAP=false
ENV NODE_ENV=production
RUN npm run build


# => Run container
FROM node:21-alpine3.18 AS runner

WORKDIR /app

ENV NODE_ENV=production

# 创建非 root 用户
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# 复制必要的文件
COPY --from=builder /app/next.config.mjs ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json

# 复制 .next 构建产物
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# 启动 Next.js
CMD ["node", "server.js"] 